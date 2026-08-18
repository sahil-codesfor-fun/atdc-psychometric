"use client";

import LayoutWrapper from "@/components/wrapper/LayoutWrapper";
import { 
  Monitor, 
  CheckCircle2, 
  Settings, 
  TrendingUp, 
  Database, 
  BookText, 
  Calculator, 
  Music, 
  Dumbbell, 
  User, 
  Users, 
  Eye, 
  Leaf, 
  HelpCircle, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  GraduationCap, 
  UserCheck, 
  Building2, 
  Briefcase, 
  Mail, 
  Globe,
  Award,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function CareerGuidancePage() {
  return (
    <LayoutWrapper>
      <div className="space-y-16 py-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1528] via-[#0f2c59] to-[#1e3a8a] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-700/50">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-2xl shadow-md inline-block">
                <img src="/logo.jpeg" alt="ATDC Logo" className="h-12 sm:h-14 w-auto object-contain rounded-lg" />
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <span>Career Roadmap &amp; Guidance Framework</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
              Chart Your Optimal <br />
              <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-white bg-clip-text text-transparent">
                Career &amp; Academic Trajectory
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Standardized psychometric profiling mapped to international O*NET vocational databases and contemporary industry standards by Advanced Training &amp; Development Consultant (ATDC).
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/test?test=riasec">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 h-12 rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
                  Take Holland RIASEC Test
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/test?test=hgmi">
                <Button size="lg" variant="outline" className="border-slate-400/40 text-white hover:bg-white/10 font-semibold px-6 h-12 rounded-full backdrop-blur-xs">
                  Multiple Intelligences (HGMI)
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Take Career Guidance Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Objective Diagnostics</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f2c59] tracking-tight mt-1">
                What is the ATDC Career Guidance Assessment?
              </h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our career guidance framework uses empirical psychometric benchmarks to evaluate your intrinsic behavioral interests, cognitive aptitudes, and personality tendencies. It maps your profile against more than 250 validated career paths and vocational opportunities.
            </p>

            <div className="p-6 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-4xl sm:text-5xl font-black text-blue-700">93%</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                of students and professionals in India are aware of fewer than 10 conventional career paths, despite over 5,000 specialized occupational roles active in today's economy.
              </p>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              Whether you are deciding on your higher education streams or planning an executive career pivot, our multidimensional diagnostic report provides clarity, empirical validation, and actionable learning milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Empirical Psychometrics", desc: "Built on globally recognized psychometric foundations including Holland's RIASEC and Gardner's Intelligences.", icon: Monitor },
              { title: "Personalized Fitment", desc: "Tailored career options mapped to your highest scoring aptitude and personality traits.", icon: CheckCircle2 },
              { title: "O*NET Database Mapped", desc: "Aligned with international occupational classification standards and modern job profiles.", icon: Database },
              { title: "Actionable Learning Paths", desc: "Concrete recommendations for courses, degrees, certifications, and technical skill acquisition.", icon: TrendingUp },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx} className="border border-slate-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all rounded-2xl">
                  <CardContent className="p-5 space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-[#0f2c59]">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 8 Gardner Multiple Intelligence Dimensions */}
        <section className="space-y-8 bg-slate-50/70 p-8 sm:p-12 rounded-3xl border border-slate-200">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge className="bg-[#0f2c59] text-white">Howard Gardner Theory</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f2c59]">
              The 8 Dimensions of Multiple Intelligences
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Understanding where your natural cognitive strengths lie allows you to select vocations where you inherently excel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Linguistic", desc: "Proficiency in verbal reasoning, writing, communication, journalism, and law.", icon: BookText, color: "text-blue-600 bg-blue-50" },
              { name: "Logical-Mathematical", desc: "Strength in numerical deduction, algorithm design, finance, engineering, and scientific problem solving.", icon: Calculator, color: "text-indigo-600 bg-indigo-50" },
              { name: "Musical", desc: "Acute auditory perception, rhythm, acoustic composition, sound engineering, and creative media.", icon: Music, color: "text-purple-600 bg-purple-50" },
              { name: "Bodily-Kinesthetic", desc: "Physical coordination, surgical agility, athletics, technical manufacturing, and fine design dexterity.", icon: Dumbbell, color: "text-rose-600 bg-rose-50" },
              { name: "Spatial", desc: "Visualizing 3D structures, industrial architecture, UI/UX design, geospatial analytics, and cinematography.", icon: Eye, color: "text-cyan-600 bg-cyan-50" },
              { name: "Interpersonal", desc: "High emotional empathy, human leadership, negotiations, diplomacy, consulting, and organizational management.", icon: Users, color: "text-amber-600 bg-amber-50" },
              { name: "Intrapersonal", desc: "Deep self-awareness, philosophical inquiry, psychological research, and entrepreneurial autonomy.", icon: User, color: "text-emerald-600 bg-emerald-50" },
              { name: "Naturalist", desc: "Understanding ecosystems, biotechnology, environmental science, agriculture, and sustainability research.", icon: Leaf, color: "text-teal-600 bg-teal-50" }
            ].map((dim, idx) => {
              const Icon = dim.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-shadow space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dim.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0f2c59]">{dim.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{dim.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Impact & Training Statistics */}
        <section className="bg-gradient-to-r from-[#0f2c59] to-[#1e40af] text-white p-8 sm:p-12 rounded-3xl shadow-xl">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <h2 className="text-2xl sm:text-4xl font-black">
              Turn Recommendations into Concrete Career Reality
            </h2>
            <p className="text-slate-200 text-sm max-w-2xl mx-auto">
              At Advanced Training &amp; Development Consultant (ATDC), we combine rigorous psychometric testing with vocational training frameworks to prepare candidates for high-growth modern careers.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white">450+</div>
                <div className="text-xs text-blue-200 font-semibold">Training Modules</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white">250K+</div>
                <div className="text-xs text-blue-200 font-semibold">Candidates Assessed</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white">500+</div>
                <div className="text-xs text-blue-200 font-semibold">Corporate Engagements</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white">98.4%</div>
                <div className="text-xs text-blue-200 font-semibold">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Institutional Inquiries</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f2c59]">
              Connect with ATDC Advisory
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              For institutional assessment batched testing, enterprise psychometrics, or custom consulting inquiries:
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Mail className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[11px] uppercase font-bold text-slate-500">Official Inquiries</div>
                <a href="mailto:info@atdc.com" className="text-sm font-bold text-blue-700 hover:underline">
                  info@atdc.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Mail className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[11px] uppercase font-bold text-slate-500">Administration &amp; Support</div>
                <a href="mailto:admin@atdc.com" className="text-sm font-bold text-blue-700 hover:underline">
                  admin@atdc.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LayoutWrapper>
  );
}