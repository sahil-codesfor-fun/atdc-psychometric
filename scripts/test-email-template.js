import { generateAssessmentEmailHtml } from '../src/lib/emailTemplate.js';

console.log('Testing Email Template Generation for all test kinds...\n');

// 1. Belbin Sample Payload
const belbinPayload = {
  name: "John Doe",
  dob: "2000-01-01",
  course: "B.Tech CSE",
  email: "john@example.com",
  phone: "9876543210",
  occupation: "Engineer",
  institution: "Geeta University",
  city: "Panipat",
  state: "Haryana",
  test_key: "belbin",
  test_name: "Belbin Team Role Assessment",
  score: 24,
  result: {
    title: "Belbin Team Role Profile",
    description: "Your primary team role is Shaper, with Co-ordinator as your secondary role. The profile reflects your preferred contribution to team work based on the points you allocated across the seven sections.",
    primaryRole: { id: "SH", name: "Shaper", score: 24 },
    secondaryRole: { id: "CO", name: "Co-ordinator", score: 18 },
    breakdown: [
      { id: "SH", name: "Shaper", score: 24 },
      { id: "CO", name: "Co-ordinator", score: 18 },
      { id: "PL", name: "Plant", score: 12 },
      { id: "RI", name: "Resource Investigator", score: 10 },
      { id: "ME", name: "Monitor Evaluator", score: 8 },
      { id: "IMP", name: "Implementer", score: 6 },
      { id: "TW", name: "Team Worker", score: 4 },
      { id: "CF", name: "Completer-Finisher", score: 2 },
    ],
    roleDetails: [
      { id: "SH", name: "Shaper", score: 24, strength: "Drive and challenge", weakness: "Impatience", function: "Generates action" },
      { id: "CO", name: "Co-ordinator", score: 18, strength: "Clarifies goals", weakness: "Manipulative", function: "Coordinates skills" },
      { id: "PL", name: "Plant", score: 12, strength: "Creative", weakness: "Ignores details", function: "Solves problems" }
    ],
    suggestions: [
      "Use your Shaper strengths consciously when working in teams.",
      "Partner with people whose strengths complement your Shaper profile."
    ]
  }
};

const belbinHtml = generateAssessmentEmailHtml(belbinPayload);
console.log('✓ Belbin HTML generated successfully, length:', belbinHtml.length);
if (!belbinHtml.includes('Shaper') || !belbinHtml.includes('Generates action') || !belbinHtml.includes('💡 Recommendations')) {
  throw new Error('Belbin HTML missing key content');
}

// 2. McClelland Sample Payload
const mcclellandPayload = {
  name: "Jane Smith",
  email: "jane@example.com",
  test_key: "mcclelland",
  test_name: "McClelland Motivation Profile",
  score: 32,
  result: {
    title: "McClelland Motivation Profile",
    description: "Your strongest motivational need is Achievement, followed by Affiliation.",
    dominantNeed: { id: "Achievement", name: "Achievement", score: 32, max: 40, percentage: 80 },
    secondaryNeed: { id: "Affiliation", name: "Affiliation", score: 26, max: 40, percentage: 65 },
    breakdown: [
      { id: "Achievement", name: "Achievement", score: 32, max: 40, percentage: 80 },
      { id: "Affiliation", name: "Affiliation", score: 26, max: 40, percentage: 65 },
      { id: "Power", name: "Power", score: 18, max: 40, percentage: 45 }
    ],
    motivationDetails: [
      { id: "Achievement", name: "Achievement", score: 32, max: 40, percentage: 80, description: "You are motivated by accomplishing challenging goals." },
      { id: "Affiliation", name: "Affiliation", score: 26, max: 40, percentage: 65, description: "You are motivated by positive relationships." },
      { id: "Power", name: "Power", score: 18, max: 40, percentage: 45, description: "You are motivated by influence and leadership." }
    ],
    suggestions: [
      "Design academic and project goals that activate your Achievement motivation."
    ]
  }
};

const mcclellandHtml = generateAssessmentEmailHtml(mcclellandPayload);
console.log('✓ McClelland HTML generated successfully, length:', mcclellandHtml.length);
if (!mcclellandHtml.includes('Dominant Motivational Need') || !mcclellandHtml.includes('Achievement Motivation') || !mcclellandHtml.includes('32 / 40')) {
  throw new Error('McClelland HTML missing key content');
}

// 3. MBTI Sample Payload
const mbtiPayload = {
  name: "Alex Johnson",
  email: "alex@example.com",
  test_key: "mbti",
  test_name: "Myers-Briggs Type Indicator (MBTI)",
  score: 45,
  result: {
    title: "16-Type Personality Profile",
    type: "INFJ",
    typeName: "The Advocate",
    description: "Insightful, values-driven and thoughtful; you tend to look for meaning and long-term possibilities.",
    dimensionScores: [
      { dimension: "E/I", left: "E", right: "I", leftScore: 8, rightScore: 13, preference: "I" },
      { dimension: "S/N", left: "S", right: "N", leftScore: 6, rightScore: 20, preference: "N" },
      { dimension: "T/F", left: "T", right: "F", leftScore: 7, rightScore: 15, preference: "F" },
      { dimension: "J/P", left: "J", right: "P", leftScore: 16, rightScore: 8, preference: "J" }
    ],
    suggestions: [
      "Your four-letter profile is INFJ (The Advocate). Use it as a preference profile."
    ]
  }
};

const mbtiHtml = generateAssessmentEmailHtml(mbtiPayload);
console.log('✓ MBTI HTML generated successfully, length:', mbtiHtml.length);
if (!mbtiHtml.includes('INFJ') || !mbtiHtml.includes('The Advocate') || !mbtiHtml.includes('Personality Preference Breakdown')) {
  throw new Error('MBTI HTML missing key content');
}

// 4. Breakdown Sample Payload (RIASEC / HGMI)
const riasecPayload = {
  name: "Sam Wilson",
  email: "sam@example.com",
  test_key: "riasec",
  test_name: "Career Interest Profile (RIASEC)",
  score: 75,
  result: {
    title: "Career Interest Profile (RIASEC)",
    description: "Your results highlight your top career personality types.",
    breakdown: [
      { id: "Investigative", name: "Investigative (Thinkers)", score: 14 },
      { id: "Realistic", name: "Realistic (Doers)", score: 12 },
      { id: "Artistic", name: "Artistic (Creators)", score: 10 }
    ],
    suggestions: [
      "Look for careers that combine your top two interest areas."
    ]
  }
};

const riasecHtml = generateAssessmentEmailHtml(riasecPayload);
console.log('✓ RIASEC/Breakdown HTML generated successfully, length:', riasecHtml.length);
if (!riasecHtml.includes('Investigative (Thinkers)') || !riasecHtml.includes('14 pts')) {
  throw new Error('RIASEC HTML missing key content');
}

// 5. Standard Test with Student Profile & Goal (e.g. RSES)
const rsesPayload = {
  name: "Taylor Swift",
  email: "taylor@example.com",
  test_key: "rses",
  test_name: "Rosenberg Self-Esteem Scale",
  score: 25,
  result: {
    title: "High Self-Esteem",
    description: "Suggests strong self-belief, emotional resilience, and a positive self-image.",
    studentProfile: "Demonstrates leadership, active class participation, healthy peer relationships.",
    goal: "Maintain balance between confidence and self-awareness for sustained success.",
    suggestions: [
      "Offer opportunities for mentoring peers or leading projects."
    ]
  }
};

const rsesHtml = generateAssessmentEmailHtml(rsesPayload);
console.log('✓ Standard Test (RSES) HTML generated successfully, length:', rsesHtml.length);
if (!rsesHtml.includes('High Self-Esteem') || !rsesHtml.includes('Student Profile') || !rsesHtml.includes('Goal') || !rsesHtml.includes('25')) {
  throw new Error('Standard Test HTML missing key content');
}

// 6. JSON String result
const jsonStringPayload = {
  name: "Robin",
  email: "robin@example.com",
  test_name: "Growth vs Fixed Mindset",
  score: 35,
  result: JSON.stringify({
    title: "Growth Mindset",
    description: "You strongly believe that learning and effort lead to improvement.",
    suggestions: ["Model mindset for others."]
  })
};

const jsonStringHtml = generateAssessmentEmailHtml(jsonStringPayload);
console.log('✓ JSON String Result HTML generated successfully, length:', jsonStringHtml.length);
if (!jsonStringHtml.includes('Growth Mindset')) {
  throw new Error('JSON String Result HTML missing key content');
}

console.log('\nAll email template tests PASSED successfully!');
