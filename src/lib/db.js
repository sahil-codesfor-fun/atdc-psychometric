import mysql from 'mysql2/promise';

let pool;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      return {
        query: async () => [[]],
        execute: async () => [{ insertId: 0 }],
      };
    }
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0,
      connectTimeout: 20000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

async function withRetry(fn, maxRetries = 5, initialDelay = 300) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      const isRetryable =
        error.code === 'ER_CON_COUNT_ERROR' ||
        error.code === 'PROTOCOL_CONNECTION_LOST' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ER_LOCK_WAIT_TIMEOUT' ||
        error.code === 'ER_LOCK_DEADLOCK' ||
        error.message?.includes('Too many connections');

      if (attempt <= maxRetries && isRetryable) {
        const backoff = initialDelay * Math.pow(1.5, attempt - 1) + Math.random() * 200;
        console.warn(`[DB Queue Retry] Attempt ${attempt}/${maxRetries} busy. Retrying in ${Math.round(backoff)}ms...`);
        await new Promise((res) => setTimeout(res, backoff));
      } else {
        throw error;
      }
    }
  }
}

const db = {
  query: (...args) => withRetry(() => getPool().query(...args)),
  execute: (...args) => withRetry(() => getPool().execute(...args)),
};

export default db;
