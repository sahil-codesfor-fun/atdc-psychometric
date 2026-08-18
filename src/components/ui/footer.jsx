import { Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b1528] text-slate-300 border-t border-slate-800/80 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="ATDC Logo" 
              className="h-10 sm:h-11 w-auto object-contain rounded-lg bg-white p-0.5 shadow-sm" 
            />
            <div>
              <div className="font-black text-base text-white tracking-tight">
                ATDC
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Advanced Training &amp; Development Consultant
              </p>
            </div>
          </div>

          {/* Direct Support Contact */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Support:</span>
            <a href="mailto:info@atdc.com" className="font-bold text-blue-300 hover:text-white transition-colors">
              info@atdc.com
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-slate-400 font-medium">Advanced Training &amp; Development Consultant (ATDC)</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Standardized Psychometric &amp; Behavioral Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
