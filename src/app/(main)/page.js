"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Target,
  Brain,
  Users,
  Flame,
  ShieldCheck,
  Award,
  TrendingUp,
  BookOpen,
  Compass,
  Briefcase,
  Layers,
  ChevronRight
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Assessments" },
  { id: "career", label: "Career & Vocational", icon: Briefcase },
  { id: "intelligence", label: "Cognitive & Intelligence", icon: Brain },
  { id: "leadership", label: "Leadership & Team Roles", icon: Users },
  { id: "mindset", label: "Mindset & Motivation", icon: Flame },
  { id: "wellness", label: "Emotional & Behavioral", icon: ShieldCheck },
];

const TESTS_CATALOG = [
  {
    href: "/test?test=riasec",
    testKey: "riasec",
    category: "career",
    title: "Holland RIASEC Career Interest Inventory",
    badge: "Career Alignment",
    time: "8-10 mins",
    questions: "48 Items",
    desc: "Examines vocational preferences across 6 core domains: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional to map optimal career trajectories.",
    gradient: "from-blue-600 to-indigo-700",
    accentBorder: "group-hover:border-blue-500",
    pillBg: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    href: "/test?test=mbti",
    testKey: "mbti",
    category: "leadership",
    title: "Myers-Briggs Type Indicator (MBTI 93-Item)",
    badge: "Personality Archetype",
    time: "12-15 mins",
    questions: "93 Items",
    desc: "Authorized 93-question personality assessment revealing your 4-letter cognitive preference profile (E/I, S/N, T/F, J/P) across 16 distinctive types.",
    gradient: "from-indigo-600 to-sky-600",
    accentBorder: "group-hover:border-indigo-500",
    pillBg: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  {
    href: "/test?test=belbin",
    testKey: "belbin",
    category: "leadership",
    title: "Meredith Belbin Team Role Assessment",
    badge: "Team Synergy",
    time: "10-12 mins",
    questions: "7 Sections",
    desc: "Identifies your operational and behavioral contributions in teams across 8 Belbin roles, detailing primary and secondary leadership roles.",
    gradient: "from-blue-700 to-cyan-600",
    accentBorder: "group-hover:border-cyan-500",
    pillBg: "bg-cyan-50 text-cyan-800 border-cyan-200"
  },
  {
    href: "/test?test=mcclelland",
    testKey: "mcclelland",
    category: "mindset",
    title: "McClelland Motivation Profile",
    badge: "Intrinsic Drivers",
    time: "10-12 mins",
    questions: "44 Items",
    desc: "Quantifies your underlying motivational drivers across Achievement, Affiliation, and Power to optimize workplace performance and engagement.",
    gradient: "from-amber-600 to-orange-600",
    accentBorder: "group-hover:border-amber-500",
    pillBg: "bg-amber-50 text-amber-800 border-amber-200"
  },
  {
    href: "/test?test=hgmi",
    testKey: "hgmi",
    category: "intelligence",
    title: "Multiple Intelligence Test (Howard Gardner - English)",
    badge: "Cognitive Profile",
    time: "8-10 mins",
    questions: "40 Items",
    desc: "Measures relative strength across 8 intelligence dimensions: Linguistic, Logical-Mathematical, Spatial, Musical, Bodily, Interpersonal, Intrapersonal & Naturalist.",
    gradient: "from-teal-600 to-emerald-700",
    accentBorder: "group-hover:border-teal-500",
    pillBg: "bg-teal-50 text-teal-800 border-teal-200"
  },
  {
    href: "/test?test=hgmi_hindi",
    testKey: "hgmi_hindi",
    category: "intelligence",
    title: "बहु-बुद्धि परीक्षण (Multiple Intelligence - Hindi)",
    badge: "बुद्धि प्रोफ़ाइल",
    time: "8-10 mins",
    questions: "40 Items",
    desc: "हावर्ड गार्डनर के सिद्धांत पर आधारित 8 प्रकार की बुद्धिमत्ता (भाषाई, तार्किक, स्थानिक, संगीतात्मक) में अपनी अद्वितीय क्षमताओं की पहचान करें।",
    gradient: "from-emerald-600 to-teal-700",
    accentBorder: "group-hover:border-emerald-500",
    pillBg: "bg-emerald-50 text-emerald-800 border-emerald-200"
  },
  {
    href: "/test?test=emotional",
    testKey: "emotional",
    category: "wellness",
    title: "Emotional Intelligence Scale (EQ)",
    badge: "Emotional Mastery",
    time: "6-8 mins",
    questions: "25 Items",
    desc: "Assesses self-awareness, emotional regulation, empathy, and social agility critical for interpersonal harmony and modern leadership.",
    gradient: "from-blue-600 to-purple-600",
    accentBorder: "group-hover:border-purple-500",
    pillBg: "bg-purple-50 text-purple-800 border-purple-200"
  },
  {
    href: "/test?test=dweck",
    testKey: "dweck",
    category: "mindset",
    title: "Growth vs. Fixed Mindset Scale",
    badge: "Neuroplasticity",
    time: "4-5 mins",
    questions: "16 Items",
    desc: "Based on Dr. Carol Dweck's research, evaluates whether you perceive ability as malleable through continuous deliberate effort or fixed by innate talent.",
    gradient: "from-amber-500 to-yellow-600",
    accentBorder: "group-hover:border-amber-400",
    pillBg: "bg-yellow-50 text-yellow-800 border-yellow-200"
  },
  {
    href: "/test?test=rses",
    testKey: "rses",
    category: "wellness",
    title: "Rosenberg Self-Esteem Scale",
    badge: "Self-Worth",
    time: "3-4 mins",
    questions: "10 Items",
    desc: "The global gold-standard scale quantifying self-acceptance, personal adequacy, and internal confidence levels across varying situations.",
    gradient: "from-sky-600 to-blue-700",
    accentBorder: "group-hover:border-sky-500",
    pillBg: "bg-sky-50 text-sky-800 border-sky-200"
  },
  {
    href: "/test?test=wellbeing",
    testKey: "wellbeing",
    category: "wellness",
    title: "Psychological Well-Being Scale",
    badge: "Holistic Health",
    time: "5-6 mins",
    questions: "20 Items",
    desc: "Measures overall life satisfaction, positive affect, emotional resilience, and psychological wellness indicators.",
    gradient: "from-emerald-500 to-teal-600",
    accentBorder: "group-hover:border-emerald-400",
    pillBg: "bg-emerald-50 text-emerald-800 border-emerald-200"
  },
  {
    href: "/test?test=enterpreneurship",
    testKey: "enterpreneurship",
    category: "career",
    title: "Student Entrepreneurial Aptitude Scale",
    badge: "Venture Readiness",
    time: "6-8 mins",
    questions: "25 Items",
    desc: "Evaluates entrepreneurial traits including calculated risk appetite, creative innovation, tenacity, and proactive opportunity recognition.",
    gradient: "from-blue-600 to-cyan-600",
    accentBorder: "group-hover:border-cyan-500",
    pillBg: "bg-blue-50 text-blue-800 border-blue-200"
  },
  {
    href: "/test?test=achievement",
    testKey: "achievement",
    category: "mindset",
    title: "Achievement Motivation Scale",
    badge: "Goal Drive",
    time: "5-7 mins",
    questions: "20 Items",
    desc: "Assesses internal drive, persistence toward challenging goals, competitiveness, and commitment to excellence.",
    gradient: "from-indigo-600 to-blue-700",
    accentBorder: "group-hover:border-indigo-500",
    pillBg: "bg-indigo-50 text-indigo-800 border-indigo-200"
  },
  {
    href: "/test?test=aggression",
    testKey: "aggression",
    category: "wellness",
    title: "Aggression & Frustration Tolerance Scale",
    badge: "Stress Response",
    time: "5-6 mins",
    questions: "20 Items",
    desc: "Analyzes behavioral responses to anger, stress triggers, and social conflict to foster emotional stability.",
    gradient: "from-rose-600 to-red-700",
    accentBorder: "group-hover:border-rose-500",
    pillBg: "bg-rose-50 text-rose-800 border-rose-200"
  },
  {
    href: "/test?test=peerpressure",
    testKey: "peerpressure",
    category: "wellness",
    title: "Peer Influence & Pressure Resistance Scale",
    badge: "Autonomy",
    time: "5-6 mins",
    questions: "20 Items",
    desc: "Determines how strongly external peer opinions and social conformism impact personal judgment and decision-making.",
    gradient: "from-purple-600 to-indigo-700",
    accentBorder: "group-hover:border-purple-500",
    pillBg: "bg-purple-50 text-purple-800 border-purple-200"
  },
  {
    href: "/test?test=forgiveness",
    testKey: "forgiveness",
    category: "wellness",
    title: "Emotional Resilience & Forgiveness Scale",
    badge: "Equanimity",
    time: "4-5 mins",
    questions: "15 Items",
    desc: "Measures capacity to release emotional grievance, foster empathy, overcome adversity, and restore cognitive peace.",
    gradient: "from-pink-600 to-rose-600",
    accentBorder: "group-hover:border-pink-500",
    pillBg: "bg-pink-50 text-pink-800 border-pink-200"
  }
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTests = useMemo(() => {
    return TESTS_CATALOG.filter((item) => {
      return selectedCategory === "all" || item.category === selectedCategory;
    });
  }, [selectedCategory]);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0b1528] via-[#0f2c59] to-[#132c52] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-700/50">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-white p-2.5 rounded-2xl shadow-xl border border-white/30 inline-flex items-center gap-3">
              <img src="/logo.jpeg" alt="ATDC Logo" className="h-14 sm:h-16 w-auto object-contain rounded-lg" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <span>Advanced Training &amp; Development Consultant (ATDC)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
            Scientific Psychometric &amp; <br />
            <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-white bg-clip-text text-transparent">
              Career Competency Portal
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover cognitive capabilities, behavioral traits, leadership profiles, and tailored career pathways through our standardized psychometric framework.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/test">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 h-12 rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
                Explore All 15 Assessments
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/career-guidance-test">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-6 h-12 rounded-full backdrop-blur-md shadow-sm transition-all hover:scale-105">
                <BookOpen className="w-4 h-4 mr-2 text-cyan-300" />
                Career Guidance Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Key Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Validated Test Instruments", val: "15+", sub: "Standardized psychometric scales", icon: Target, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
          { label: "Candidates Evaluated", val: "250K+", sub: "Pan-India institutional reach", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
          { label: "Psychometric Reliability", val: "98.4%", sub: "Validated scoring algorithms", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Corporate & School Partners", val: "500+", sub: "Enterprise & vocational training", icon: Award, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg} border`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-[#0f2c59] tracking-tight">{stat.val}</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800">{stat.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.sub}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Assessment Catalogue with Category Filtering */}
      <section className="space-y-8" id="catalogue">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Assessment Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f2c59] tracking-tight">
            Explore Standardized Assessment Batteries
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Select an instrument to evaluate specialized cognitive, behavioral, and vocational dimensions.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected
                    ? "bg-[#0f2c59] text-white shadow-md shadow-blue-900/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Link key={test.testKey} href={test.href} className="group block h-full">
              <Card className="h-full border border-slate-200/90 bg-white hover:border-blue-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden rounded-2xl">
                <CardContent className="p-6 space-y-4 flex flex-col flex-1">
                  {/* Top metadata tags */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge className={`font-bold text-xs border ${test.pillBg} shadow-none`}>
                      {test.badge}
                    </Badge>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {test.time}
                      </span>
                      <span>&bull;</span>
                      <span className="font-semibold text-slate-700">{test.questions}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-bold text-[#0f2c59] group-hover:text-blue-600 transition-colors line-clamp-2">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {test.desc}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-600">
                    <span className="flex items-center gap-1.5">
                      Start Assessment
                    </span>
                    <div className="w-7 h-7 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No assessments found in this category</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Select another category tab to view available assessment batteries.
            </p>
            <Button variant="outline" onClick={() => setSelectedCategory("all")}>
              Show All Assessments
            </Button>
          </div>
        )}
      </section>

      {/* Compact Methodology Section */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Methodology</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Standardized 4-Step Assessment Process
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Scientifically calibrated workflow from instrument selection to verified diagnostic delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Select Instrument", desc: "Choose from 15 validated psychometric batteries." },
            { step: "02", title: "Profile Verification", desc: "Enter candidate & institutional tracking details." },
            { step: "03", title: "Assessment Battery", desc: "Complete standardized adaptive items." },
            { step: "04", title: "Diagnostic Dossier", desc: "Receive immediate breakdown & email dispatch." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-start gap-3">
              <span className="text-lg font-black text-blue-400 shrink-0">{item.step}</span>
              <div>
                <h3 className="font-bold text-sm text-white">{item.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

