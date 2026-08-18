"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TESTS } from "@/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  GraduationCap, 
  RotateCcw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import axios from "axios";

const selectFields = {
  gender: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ],
};

function ResultContent({ testKey, resultDetails, score, candidateName, testTitle }) {
  if (!resultDetails) return null;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f2c59] to-[#1e40af] text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo.jpeg" alt="ATDC Logo" className="h-14 w-auto object-contain rounded-xl bg-white p-1 shadow-xs" />
            <div>
              <div className="text-xs uppercase tracking-widest text-blue-200 font-bold mb-0.5">
                ATDC Diagnostic Evaluation Report
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{testTitle || "Psychometric Assessment"}</h3>
              {candidateName && (
                <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                  Candidate: <strong className="text-white">{candidateName}</strong>
                </p>
              )}
            </div>
          </div>
          {score !== null && score !== undefined && !isNaN(score) && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20 min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">Total Score</div>
              <div className="text-3xl font-black text-white">{score}</div>
            </div>
          )}
        </div>
      </div>

      {/* Belbin Specialized Result */}
      {testKey === "belbin" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-center">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-700">Primary Team Role</span>
              <p className="text-2xl font-black text-[#0f2c59] mt-1">{resultDetails.primaryRole?.name}</p>
              <p className="text-3xl font-black text-blue-700 mt-1">{resultDetails.primaryRole?.score} <span className="text-xs font-medium text-slate-500">pts</span></p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-600">Secondary Team Role</span>
              <p className="text-2xl font-black text-[#0f2c59] mt-1">{resultDetails.secondaryRole?.name}</p>
              <p className="text-3xl font-black text-slate-700 mt-1">{resultDetails.secondaryRole?.score} <span className="text-xs font-medium text-slate-500">pts</span></p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0f2c59] mb-2">Role Behavioral Profile</h4>
            <p className="text-slate-700 text-sm leading-relaxed">{resultDetails.description}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-3">
            <h4 className="font-bold text-[#0f2c59] text-base">Complete Team Role Hierarchy</h4>
            <div className="space-y-3">
              {resultDetails.roleDetails?.map((role, index) => (
                <div key={role.id} className={`rounded-xl border p-4 transition-shadow bg-white ${index < 2 ? "border-blue-300 shadow-xs" : "border-slate-200"}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0f2c59]">{index + 1}. {role.name}</span>
                      {index === 0 && <Badge className="bg-[#0f2c59] text-white text-[10px]">Primary</Badge>}
                      {index === 1 && <Badge variant="secondary" className="text-[10px]">Secondary</Badge>}
                    </div>
                    <span className="font-bold text-slate-900">{role.score} pts</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div><strong className="text-slate-800">Function:</strong> {role.function}</div>
                    <div><strong className="text-emerald-700">Strength:</strong> {role.strength}</div>
                    <div><strong className="text-rose-700">Watch-out:</strong> {role.weakness}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Suggestions suggestions={resultDetails.suggestions} />
        </div>
      )}

      {/* McClelland Specialized Result */}
      {testKey === "mcclelland" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6 text-center">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-700">Dominant Motivational Driver</span>
            <p className="text-3xl font-black text-[#0f2c59] mt-1">{resultDetails.dominantNeed?.name}</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              Secondary Motivation Driver: <strong>{resultDetails.secondaryNeed?.name}</strong>
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0f2c59] mb-2">Motivational Overview</h4>
            <p className="text-slate-700 text-sm leading-relaxed">{resultDetails.description}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {resultDetails.motivationDetails?.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-bold text-sm text-[#0f2c59]">{item.name}</h5>
                  <span className="text-xs font-bold text-blue-700">{item.score}/40</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <Suggestions suggestions={resultDetails.suggestions} />
        </div>
      )}

      {/* MBTI Specialized Result */}
      {testKey === "mbti" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-white border border-blue-200 p-6 text-center">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-700">Your 4-Letter Personality Profile</span>
            <p className="text-5xl font-black tracking-widest text-[#0f2c59] my-2">{resultDetails.type}</p>
            <p className="text-lg font-bold text-indigo-700">{resultDetails.typeName}</p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#0f2c59] mb-2">Personality Overview</h4>
            <p className="text-slate-700 text-sm leading-relaxed">{resultDetails.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {resultDetails.dimensionScores?.map((d) => (
              <div key={d.dimension} className="rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#0f2c59]">{d.dimension}</span>
                  <span className="font-semibold text-slate-700">Preference: <strong className="text-blue-700">{d.preference}</strong></span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className={`rounded-xl p-2.5 transition-all ${d.preference === d.left ? "bg-[#0f2c59] text-white shadow-xs" : "bg-white border border-slate-200 text-slate-700"}`}>
                    <div className="font-bold text-sm">{d.left}</div>
                    <div className="text-[11px] opacity-80">Score: {d.leftScore}</div>
                  </div>
                  <div className={`rounded-xl p-2.5 transition-all ${d.preference === d.right ? "bg-[#0f2c59] text-white shadow-xs" : "bg-white border border-slate-200 text-slate-700"}`}>
                    <div className="font-bold text-sm">{d.right}</div>
                    <div className="text-[11px] opacity-80">Score: {d.rightScore}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Suggestions suggestions={resultDetails.suggestions} />
        </div>
      )}

      {/* Categorized Test Breakdown */}
      {resultDetails.breakdown && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50 space-y-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#0f2c59]">Top Scoring Dimensions</h4>
            <div className="space-y-2">
              {resultDetails.breakdown.slice(0, 4).map((cat, index) => (
                <div key={cat.id || cat.name} className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#0f2c59]">{index + 1}. {cat.name}</span>
                  <Badge variant="outline" className="font-bold text-xs bg-blue-50 text-blue-800 border-blue-200">
                    {cat.score} pts
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          {resultDetails.description && (
            <div className="p-5 rounded-xl bg-white border border-slate-200">
              <p className="text-slate-700 text-sm leading-relaxed">{resultDetails.description}</p>
            </div>
          )}
          <Suggestions suggestions={resultDetails.suggestions} />
        </div>
      )}

      {/* Standard Results Fallback */}
      {!["belbin", "mcclelland", "mbti"].includes(testKey) && !resultDetails.breakdown && (
        <div className="space-y-5">
          {typeof resultDetails === "string" ? (
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <p className="text-xl font-bold text-[#0f2c59]">{resultDetails}</p>
            </div>
          ) : (
            <>
              {resultDetails.title && (
                <div className="text-center font-bold text-lg text-[#0f2c59]">
                  {resultDetails.title}
                </div>
              )}
              {resultDetails.description && (
                <div className="p-5 rounded-xl bg-white border border-slate-200">
                  <p className="text-slate-700 text-sm leading-relaxed text-center font-medium">
                    {resultDetails.description}
                  </p>
                </div>
              )}
              {resultDetails.studentProfile && <InfoBox title="Candidate Profile Assessment" text={resultDetails.studentProfile} />}
              {resultDetails.goal && <InfoBox title="Recommended Development Goal" text={resultDetails.goal} />}
              <Suggestions suggestions={resultDetails.suggestions} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function InfoBox({ title, text }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <h5 className="font-bold text-xs uppercase tracking-wider text-[#0f2c59]">{title}</h5>
      <p className="text-slate-700 text-sm mt-1 leading-relaxed">{text}</p>
    </div>
  );
}

function Suggestions({ suggestions }) {
  if (!suggestions?.length) return null;
  return (
    <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
        <CheckCircle className="w-4 h-4 text-emerald-600" />
        <span>Tailored Growth &amp; Development Action Items</span>
      </div>
      <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
        {suggestions.map((s, i) => (
          <li key={i} className="leading-relaxed">{s}</li>
        ))}
      </ul>
    </div>
  );
}

function SchoolSelect({ value, onChange, schools }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const filteredSchools = useMemo(() => {
    if (!value) return schools;
    return schools.filter((s) => s.toLowerCase().includes(value.toLowerCase()));
  }, [schools, value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <Label htmlFor="school_name" className="text-xs font-semibold text-slate-700">
        School / Institution / Center
      </Label>
      <div className="relative">
        <Input
          id="school_name"
          type="text"
          placeholder="Select or type your institution..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pr-8 bg-white border-slate-300 rounded-xl text-sm"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
        >
          <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && filteredSchools.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95">
          {filteredSchools.map((school, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors ${
                value === school
                  ? "bg-[#0f2c59] text-white font-medium"
                  : "text-slate-800 hover:bg-slate-100"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(school);
                setIsOpen(false);
              }}
            >
              {school}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AssessmentRunnerPage() {
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [open, setOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [resultDetails, setResultDetails] = useState(null);
  const [schools, setSchools] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "", dob: "", class: "", gender: "", email: "", father_name: "", phone: "", school_name: "", state: "", city: "",
  });

  const test = selectedTest ? TESTS[selectedTest] : null;
  const kind = test?.kind;
  const isSpecial = ["belbin", "mcclelland", "mbti"].includes(selectedTest);
  const totalSteps = kind === "belbin" ? test.sections.length : test?.questions?.length || 0;

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const testParam = query.get("test");
    if (testParam && TESTS[testParam]) setSelectedTest(testParam);
    axios.get("/api/schools").then((res) => setSchools(res.data)).catch(console.error);
  }, []);

  const reset = () => {
    setScore(null); setAnswers([]); setCurrentIndex(0); setResultDetails(null); setFormSubmitted(false); setOpen(false);
  };

  const handleTestSelect = (val) => { setSelectedTest(val); reset(); };

  const handleStandardAnswer = (value) => {
    const updated = [...answers]; updated[currentIndex] = value; setAnswers(updated);
  };

  const handleBelbinPoint = (sectionIndex, itemIndex, value) => {
    const updated = answers.length ? answers.map((s) => [...(s || [])]) : Array.from({ length: test.sections.length }, () => Array(8).fill(0));
    updated[sectionIndex][itemIndex] = Math.max(0, Math.min(10, Number(value) || 0));
    setAnswers(updated);
  };

  const sectionTotal = kind === "belbin" ? (answers[currentIndex] || []).reduce((sum, value) => sum + Number(value || 0), 0) : 0;
  const belbinSelectedCount = kind === "belbin" ? (answers[currentIndex] || []).filter((value) => Number(value || 0) > 0).length : 0;
  const belbinSectionComplete = kind === "belbin" && sectionTotal === 10 && belbinSelectedCount >= 1 && belbinSelectedCount <= 3;

  const allAnswered = useMemo(() => {
    if (!test) return false;
    if (kind === "belbin") return answers.length === test.sections.length && answers.every((section) => section?.length === 8 && section.reduce((s, v) => s + Number(v || 0), 0) === 10);
    return answers.length === test.questions.length && answers.every((answer) => answer !== undefined && answer !== null && answer !== "");
  }, [answers, kind, test]);

  const calculateScore = async () => {
    if (!test || submitting || !allAnswered) return;
    setSubmitting(true);
    try {
      let totalScore = 0;
      let interpretation;

      if (kind === "belbin") {
        interpretation = test.score(answers);
        totalScore = interpretation.primaryRole?.score ?? 0;
      } else if (kind === "mcclelland") {
        interpretation = test.score(answers);
        totalScore = interpretation.dominantNeed?.score ?? 0;
      } else if (kind === "mbti") {
        interpretation = test.score(answers);
        totalScore = interpretation.dimensionScores.reduce((sum, item) => sum + Math.max(item.leftScore, item.rightScore), 0);
      } else if (test.categories) {
        const categoryScores = test.categories.map((category) => {
          let categorySum = 0;
          if (category.range && category.range.length === 2) {
            for (let i = category.range[0]; i <= category.range[1]; i++) {
              const val = answers[i];
              if (val !== undefined) {
                const idx = test.options.indexOf(val);
                categorySum += test.scoring[i]?.[idx] ?? idx;
              }
            }
          }
          return { ...category, score: categorySum };
        });
        totalScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0);
        interpretation = test.interpret(totalScore);
        interpretation.breakdown = categoryScores.sort((a, b) => b.score - a.score);
      } else {
        totalScore = answers.reduce((sum, val, i) => {
          const idx = test.options.indexOf(val);
          return sum + (test.scoring[i]?.[idx] || 0);
        }, 0);
        interpretation = test.interpret(totalScore);
      }

      setScore(totalScore);
      setResultDetails(interpretation);
      setOpen(true);

      const payload = {
        name: userInfo.name,
        dob: userInfo.dob || null,
        course: userInfo.class,
        married: 0,
        education: "",
        religion: "not-specified",
        gender: userInfo.gender,
        email: userInfo.email,
        occupation: userInfo.father_name,
        phone: userInfo.phone,
        institution: userInfo.school_name,
        city: userInfo.city,
        state: userInfo.state,
        rural_or_urban: "not-specified",
        test_key: selectedTest,
        test_name: test.title,
        score: totalScore,
        result: interpretation,
        responses: answers,
      };

      await axios.post("/api/submit-details", payload);
    } catch (error) {
      console.error("Failed to submit result", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Test Selection Header if not in progress */}
      {!formSubmitted && (
        <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <span>Select Evaluation Battery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f2c59] tracking-tight">
            Choose Your Psychometric Assessment
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Select an assessment from the dropdown below to begin your evaluation.
          </p>

          <div className="pt-2">
            <Select onValueChange={handleTestSelect} value={selectedTest || ""}>
              <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-300 rounded-xl text-sm font-semibold">
                <SelectValue placeholder="Click to choose a test instrument..." />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {Object.entries(TESTS).map(([key, item]) => (
                  <SelectItem key={key} value={key} className="text-xs sm:text-sm py-2">
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Candidate Registration Form */}
      {selectedTest && !formSubmitted && (
        <Card className="border border-slate-200 bg-white shadow-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#0f2c59] to-[#1e40af] text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
                  <User className="w-4 h-4" />
                  <span>Step 1: Candidate Verification</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Candidate Profile Information
                </h2>
                <p className="text-xs text-blue-100 mt-1">
                  Please fill your details accurately. Your personalized diagnostic report will be registered under this profile.
                </p>
              </div>
              <img src="/logo.jpeg" alt="ATDC Logo" className="h-12 w-auto object-contain rounded-xl bg-white p-1 shadow-xs shrink-0 self-start sm:self-auto" />
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["name", "Candidate Full Name", "text", "e.g. Rahul Sharma"],
                ["dob", "Date of Birth", "date", ""],
                ["class", "Class / Designation / Stream", "text", "e.g. 12th Non-Med / B.Tech / Analyst"],
                ["email", "Email Address (For Report Delivery)", "email", "e.g. name@example.com"],
                ["father_name", "Parent / Guardian Name", "text", "e.g. S. K. Sharma"],
                ["phone", "Contact Phone Number", "tel", "e.g. +91 98765 43210"],
                ["school_name", "School / Institution / Center", "text", ""],
                ["state", "State", "text", "e.g. Haryana / Delhi / Maharashtra"],
                ["city", "City", "text", "e.g. Gurgaon / Panipat / Mumbai"]
              ].map(([key, label, type, placeholder]) => (
                key === "school_name" ? (
                  <SchoolSelect
                    key={key}
                    value={userInfo.school_name}
                    onChange={(val) => setUserInfo({ ...userInfo, school_name: val })}
                    schools={schools}
                  />
                ) : (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key} className="text-xs font-semibold text-slate-700">
                      {label}
                    </Label>
                    <Input 
                      id={key} 
                      type={type} 
                      placeholder={placeholder}
                      value={userInfo[key]} 
                      onChange={(e) => setUserInfo({ ...userInfo, [key]: e.target.value })} 
                      className="bg-white border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                )
              ))}

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Gender</Label>
                <Select value={userInfo.gender} onValueChange={(value) => setUserInfo({ ...userInfo, gender: value })}>
                  <SelectTrigger className="bg-white border-slate-300 rounded-xl text-sm">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectFields.gender.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs sm:text-sm">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                * Name, Email, and Phone are required to start the evaluation.
              </p>
              <Button 
                className="bg-[#0f2c59] text-white hover:bg-[#1e3a8a] font-bold px-8 h-11 rounded-full shadow-md transition-all hover:scale-105" 
                disabled={!userInfo.name || !userInfo.email || !userInfo.phone} 
                onClick={() => setFormSubmitted(true)}
              >
                Proceed to Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Assessment Battery */}
      {selectedTest && formSubmitted && (
        <Card className="border border-slate-200 bg-white shadow-xl rounded-3xl overflow-hidden">
          {/* Header with Progress Gauge */}
          <div className="p-6 sm:p-8 bg-slate-50/80 border-b border-slate-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{test.title}</span>
                <h2 className="text-lg sm:text-xl font-black text-[#0f2c59]">
                  {kind === "belbin" ? `Section ${currentIndex + 1} of ${totalSteps}` : `Question ${currentIndex + 1} of ${totalSteps}`}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#0f2c59] text-white text-xs font-bold px-3 py-1">
                  {Math.round(((currentIndex + 1) / totalSteps) * 100)}% Completed
                </Badge>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full transition-all duration-300" 
                style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }} 
              />
            </div>
          </div>

          <CardContent className="p-6 sm:p-10 space-y-8">
            {/* Belbin Specialized Allocator */}
            {kind === "belbin" && (
              <div className="space-y-6">
                <div className="rounded-2xl bg-blue-50/80 border border-blue-200 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                    <span>Section {test.sections[currentIndex].label}</span>
                  </div>
                  <p className="text-base font-bold text-[#0f2c59] leading-relaxed">
                    {test.sections[currentIndex].prompt}
                  </p>
                  <p className="text-xs font-medium text-slate-600">
                    Allocate <strong>exactly 10 points</strong> across 1 to 3 statements that describe your behavior best.
                  </p>
                </div>

                <div className="space-y-3">
                  {test.sections[currentIndex].items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex} 
                      className={`grid grid-cols-[1fr_90px] gap-4 items-center rounded-2xl border p-4 transition-all ${
                        Number(answers[currentIndex]?.[itemIndex] || 0) > 0
                          ? "border-blue-500 bg-blue-50/40 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        <span className="font-bold text-[#0f2c59] mr-2">{item.number}.</span>
                        {item.text}
                      </div>
                      <div className="flex items-center justify-end">
                        <Input 
                          type="number" 
                          min="0" 
                          max="10" 
                          step="1" 
                          value={answers[currentIndex]?.[itemIndex] ?? 0} 
                          onChange={(e) => handleBelbinPoint(currentIndex, itemIndex, e.target.value)} 
                          className="text-center font-bold text-base h-10 w-20 border-slate-300 rounded-xl focus-visible:ring-blue-600" 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Validation Banner */}
                <div className={`p-4 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-colors ${
                  belbinSectionComplete 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}>
                  Points Allocated: <strong>{sectionTotal} / 10</strong> &bull; Statements Selected: <strong>{belbinSelectedCount} / 3</strong>
                  {!belbinSectionComplete && (
                    <span className="block text-xs font-normal mt-1 text-amber-700">
                      Please distribute exactly 10 points across 1, 2, or 3 statements before moving forward.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* MBTI Specialized Binary Choice */}
            {kind === "mbti" && (() => {
              const question = test.questions[currentIndex];
              return (
                <div className="space-y-6">
                  <div className="text-lg sm:text-xl font-black text-[#0f2c59] leading-relaxed">
                    <span className="text-blue-600 mr-2">Q{question.number}.</span>
                    {question.prompt}
                  </div>
                  <RadioGroup value={answers[currentIndex] || ""} onValueChange={handleStandardAnswer} className="space-y-3">
                    {Object.entries(question.options).map(([key, text]) => {
                      const isSelected = answers[currentIndex] === key;
                      return (
                        <div 
                          key={key} 
                          onClick={() => handleStandardAnswer(key)}
                          className={`flex items-start space-x-3 w-full p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-blue-50/70 border-blue-600 shadow-xs"
                              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <RadioGroupItem value={key} id={`${currentIndex}-${key}`} className="mt-1" />
                          <Label className="w-full cursor-pointer leading-relaxed text-sm font-medium text-slate-800" htmlFor={`${currentIndex}-${key}`}>
                            <span className="font-bold text-[#0f2c59] mr-2">({key})</span>
                            {text}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              );
            })()}

            {/* McClelland Likert Options */}
            {kind === "mcclelland" && (
              <div className="space-y-6">
                <div className="text-lg sm:text-xl font-black text-[#0f2c59] leading-relaxed">
                  <span className="text-blue-600 mr-2">Q{currentIndex + 1}.</span>
                  {test.questions[currentIndex]}
                </div>
                <RadioGroup value={answers[currentIndex] !== undefined ? String(answers[currentIndex]) : ""} onValueChange={handleStandardAnswer} className="space-y-3">
                  {test.options.map((opt, index) => {
                    const scoreVal = String(5 - index);
                    const isSelected = answers[currentIndex] === scoreVal;
                    return (
                      <div 
                        key={index} 
                        onClick={() => handleStandardAnswer(scoreVal)}
                        className={`flex items-center space-x-3 w-full p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-600 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <RadioGroupItem value={scoreVal} id={`${currentIndex}-${index}`} />
                        <Label className="w-full cursor-pointer text-sm font-medium text-slate-800" htmlFor={`${currentIndex}-${index}`}>
                          {opt}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Standard Psychometric Test Questions */}
            {!isSpecial && (
              <div className="space-y-6">
                <div className="text-lg sm:text-xl font-black text-[#0f2c59] leading-relaxed">
                  <span className="text-blue-600 mr-2">Q{currentIndex + 1}.</span>
                  {test.questions[currentIndex]}
                </div>
                <RadioGroup value={answers[currentIndex] || ""} onValueChange={handleStandardAnswer} className="space-y-3">
                  {test.options?.map((opt, index) => {
                    const isSelected = answers[currentIndex] === opt;
                    return (
                      <div 
                        key={index} 
                        onClick={() => handleStandardAnswer(opt)}
                        className={`flex items-center space-x-3 w-full p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-600 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <RadioGroupItem value={opt} id={`${currentIndex}-${index}`} />
                        <Label className="w-full cursor-pointer text-sm font-medium text-slate-800" htmlFor={`${currentIndex}-${index}`}>
                          {opt}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Navigation Bottom Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <Button 
                variant="outline" 
                disabled={currentIndex === 0} 
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="rounded-full px-6 h-11 border-slate-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentIndex < totalSteps - 1 ? (
                <Button 
                  onClick={() => setCurrentIndex(currentIndex + 1)} 
                  disabled={kind === "belbin" ? !belbinSectionComplete : answers[currentIndex] === undefined || answers[currentIndex] === ""}
                  className="bg-[#0f2c59] text-white hover:bg-[#1e3a8a] rounded-full px-8 h-11 font-bold shadow-md"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  className="bg-emerald-600 text-white hover:bg-emerald-500 rounded-full px-8 h-11 font-bold shadow-md" 
                  onClick={calculateScore} 
                  disabled={!allAnswered || submitting}
                >
                  {submitting ? "Submitting Report..." : "Submit Assessment"}
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Results Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="text-left max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-black text-[#0f2c59] text-center">
              Official Diagnostic Assessment Dossier
            </DialogTitle>
          </DialogHeader>

          <ResultContent 
            testKey={selectedTest} 
            resultDetails={resultDetails} 
            score={score} 
            candidateName={userInfo.name}
            testTitle={test?.title}
          />

          <div className="flex items-center justify-center pt-6 border-t border-slate-100">
            <Button 
              className="bg-[#0f2c59] hover:bg-[#1e3a8a] text-white rounded-full px-8 h-11 font-bold shadow-md transition-all hover:scale-105" 
              onClick={() => { setOpen(false); window.location.href = "/"; }}
            >
              Close &amp; Return to Portal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

