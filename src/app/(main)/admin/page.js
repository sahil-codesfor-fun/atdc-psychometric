"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { 
  Eye, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Download, 
  Search, 
  Users, 
  ClipboardCheck, 
  Building, 
  LogOut,
  Calendar,
  Lock,
  Mail,
  RefreshCw
} from "lucide-react";
import { TESTS } from "@/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import jsonToCsvExport from "json-to-csv-export";

const ADMIN_EMAIL = "admin@atdc.com";
const ADMIN_PASSWORD = "admin123";

// HGMI Detailed Mapping for Admin Assessment Dossier
const HGMI_DETAILS = {
  Linguistic: {
    characteristics: "Exemplary verbal reasoning, written expression, and semantic comprehension.\n• Strong retention and contextual interpretation of communication\n• Articulate explanation of complex concepts",
    courses: ["BA LLB / Corporate Law", "Journalism & Media Communications", "Content Strategy & Public Relations", "BA (Hons) Psychology / Political Science"]
  },
  "Logical-Mathematical": {
    characteristics: "Advanced pattern detection, statistical deductions, algorithmic modeling, and quantitative problem-solving.",
    courses: ["B.Tech (Computer Science, AI/ML, Data Engineering)", "B.Sc (Hons) Mathematics / Statistics", "Chartered Accountancy / Corporate Finance", "BCA / Data Analytics"]
  },
  Musical: {
    characteristics: "Auditory pattern sensitivity, rhythm comprehension, sound engineering aptitude, and creative acoustic interpretation.",
    courses: ["Sound Engineering & Audio Production", "Media & Entertainment Management", "Creative Media & Communications", "Acoustic Architecture"]
  },
  "Bodily-Kinesthetic": {
    characteristics: "High motor dexterity, physical coordination, tactile precision, and kinesthetic agility.",
    courses: ["Industrial & Product Design", "Physiotherapy & Sports Science", "Kinetic Engineering / Robotics", "Fine Arts & Prototyping"]
  },
  Intrapersonal: {
    characteristics: "Exceptional self-awareness, metacognition, behavioral objectivity, and strategic self-governance.",
    courses: ["Organizational Psychology", "Strategic Leadership & MBA", "Philosophy & Cognitive Science", "Executive Coaching & Entrepreneurship"]
  },
  Interpersonal: {
    characteristics: "High emotional empathy, human relation building, diplomatic negotiation, and team leadership.",
    courses: ["Human Resource Management", "Corporate Consulting & Public Policy", "Hospitality & Corporate Relations", "BBA / MBA Executive Leadership"]
  },
  Spatial: {
    characteristics: "Visual-spatial reasoning, dimensional structural visualization, graphic architecture, and pictorial imagination.",
    courses: ["Architecture & Structural Engineering", "UI/UX & Product Design", "Urban Planning & Geospatial Analytics", "Visual Arts & Animation"]
  },
  Naturalist: {
    characteristics: "Environmental observation, taxonomic classification, biological curiosity, and ecological systems thinking.",
    courses: ["Biotechnology & Life Sciences", "Environmental Science & Sustainability Management", "Agricultural Economics", "Food Technology & Dietetics"]
  }
};

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [testSubmissions, setTestSubmissions] = useState([]);
  const [testName, setTestName] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchAllTestSubmissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/submissions");
      setTestSubmissions(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      console.error("Error fetching test submissions:", err);
      const errMsg = err.response?.data?.details || err.response?.data?.error || "Failed to fetch test submissions. Please check database configuration.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const session = sessionStorage.getItem("adminLoggedIn");
    if (session === "true") {
      setLoggedIn(true);
      fetchAllTestSubmissions();
    }
  }, []);

  const handleLogin = () => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminLoggedIn", "true");
      setLoggedIn(true);
      setError("");
      fetchAllTestSubmissions();
    } else {
      setError("Invalid administrative credentials. Use admin@atdc.com.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    setLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  // Filtered submissions based on test, dates, and search query
  const filteredSubmissions = useMemo(() => {
    return testSubmissions.filter((sub) => {
      // Test filter
      if (testName !== "all" && sub.test_name !== testName) return false;

      // Date range filter
      if (startDate && endDate) {
        const subDate = new Date(new Date(sub.timestamp).getTime() - 8 * 60 * 60 * 1000);
        if (subDate < startDate || subDate > endDate) return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = sub.name?.toLowerCase().includes(query);
        const emailMatch = sub.email?.toLowerCase().includes(query);
        const phoneMatch = sub.phone?.toLowerCase().includes(query);
        const instMatch = sub.institution?.toLowerCase().includes(query);
        const testMatch = sub.test_name?.toLowerCase().includes(query);
        if (!nameMatch && !emailMatch && !phoneMatch && !instMatch && !testMatch) return false;
      }

      return true;
    });
  }, [testSubmissions, testName, startDate, endDate, searchTerm]);

  // Data to export
  const dataToExport = useMemo(() => {
    return filteredSubmissions.map((submission) => ({
      "Candidate Name": submission.name,
      "Email Address": submission.email,
      "Phone": submission.phone,
      "Assessment Instrument": submission.test_name,
      "Total Score": submission.score,
      "Institution / Center": submission.institution,
      "Designation / Course": submission.course,
      "Gender": submission.gender,
      "Date of Birth": submission.dob ? new Date(submission.dob).toLocaleDateString() : "",
      "State": submission.state || "",
      "City": submission.city || "",
      "Submission Timestamp": new Date(new Date(submission.timestamp).getTime() - 8 * 60 * 60 * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      "Diagnostic Result": typeof submission.result === "string" ? submission.result : JSON.stringify(submission.result)
    }));
  }, [filteredSubmissions]);

  const totalPages = Math.ceil(filteredSubmissions.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + rowsPerPage);

  // Statistics
  const totalEvaluations = testSubmissions.length;
  const uniqueInstitutions = new Set(testSubmissions.map((s) => s.institution).filter(Boolean)).size;

  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <Card className="border border-slate-200 bg-white shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#0f2c59] to-[#1e40af] text-white p-8 text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-white p-2 rounded-2xl shadow-md inline-block">
                <img src="/logo.jpeg" alt="ATDC Logo" className="h-14 w-auto object-contain rounded-lg" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                ATDC Admin Console
              </h2>
              <p className="text-xs text-blue-200 mt-1">
                Advanced Training &amp; Development Consultant &bull; Management Console
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-5">
            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertTitle className="text-xs font-bold">Authentication Error</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Administrative Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@atdc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Security Passkey
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="bg-slate-50 border-slate-300 rounded-xl text-sm"
              />
            </div>

            <Button 
              onClick={handleLogin} 
              className="w-full bg-[#0f2c59] hover:bg-[#1e3a8a] text-white font-bold h-11 rounded-xl shadow-md transition-all hover:scale-[1.02] mt-2"
            >
              <Lock className="w-4 h-4 mr-2" />
              Secure Administrative Access
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 py-4">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0b1528] via-[#0f2c59] to-[#1e3a8a] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src="/logo.jpeg" alt="ATDC Logo" className="h-14 w-auto object-contain rounded-2xl bg-white p-1.5 shadow-md shrink-0" />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <span>ATDC Executive Administration Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Candidate Assessment Dossiers
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Advanced Training &amp; Development Consultant &bull; Real-time psychometric evaluation engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAllTestSubmissions}
            disabled={loading}
            className="border-slate-400/40 text-white hover:bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleLogout}
            className="rounded-full text-xs font-bold"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Logout
          </Button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-slate-200 bg-white rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Evaluations</p>
              <h3 className="text-3xl font-black text-[#0f2c59] mt-1">{totalEvaluations}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Filtered Dossiers</p>
              <h3 className="text-3xl font-black text-blue-700 mt-1">{filteredSubmissions.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Institutions &amp; Centers</p>
              <h3 className="text-3xl font-black text-cyan-800 mt-1">{uniqueInstitutions}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Submissions Section */}
      <Card className="border border-slate-200 bg-white shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="p-6 sm:p-8 bg-slate-50/80 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-[#0f2c59]">Candidate Submissions Registry</h2>
            <p className="text-xs text-slate-500 mt-0.5">Filter, inspect, and export diagnostic assessment records.</p>
          </div>

          <Button
            className="bg-[#0f2c59] hover:bg-[#1e3a8a] text-white font-bold text-xs rounded-full px-6 h-10 shadow-md"
            onClick={() => jsonToCsvExport({ data: dataToExport, filename: `ATDC_Submissions_${new Date().toISOString().slice(0, 10)}.csv` })}
            disabled={filteredSubmissions.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Registry ({filteredSubmissions.length}) to CSV
          </Button>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search candidate, email, phone..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 bg-slate-50 border-slate-300 rounded-xl text-xs sm:text-sm h-11"
              />
            </div>

            {/* Test Filter */}
            <div>
              <Select value={testName} onValueChange={(val) => { setTestName(val); setCurrentPage(1); }}>
                <SelectTrigger className="bg-slate-50 border-slate-300 rounded-xl text-xs sm:text-sm h-11">
                  <SelectValue placeholder="All Assessment Batteries" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="all" className="text-xs sm:text-sm font-semibold">
                    All Assessment Batteries
                  </SelectItem>
                  {Object.entries(TESTS).map(([key, test]) => (
                    <SelectItem key={key} value={test.title} className="text-xs sm:text-sm">
                      {test.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Pickers */}
            <div className="h-11">
              <DatePicker date={startDate} setDate={setStartDate} text="Start Date" />
            </div>
            <div className="h-11">
              <DatePicker date={endDate} setDate={setEndDate} text="End Date" />
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-xs text-[#0f2c59] w-12">#</TableHead>
                  <TableHead className="font-bold text-xs text-[#0f2c59]">Candidate Profile</TableHead>
                  <TableHead className="font-bold text-xs text-[#0f2c59]">Assessment Battery</TableHead>
                  <TableHead className="font-bold text-xs text-[#0f2c59]">Score</TableHead>
                  <TableHead className="font-bold text-xs text-[#0f2c59]">Institution / Course</TableHead>
                  <TableHead className="font-bold text-xs text-[#0f2c59]">Submission Time</TableHead>
                  <TableHead className="font-bold text-xs text-[#0f2c59] text-right">Dossier</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedSubmissions.length > 0 ? (
                  paginatedSubmissions.map((submission, index) => (
                    <TableRow key={submission.id} className="hover:bg-blue-50/30 transition-colors">
                      <TableCell className="text-xs text-slate-500 font-semibold">{startIndex + index + 1}</TableCell>
                      
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs sm:text-sm text-[#0f2c59]">{submission.name}</div>
                          <div className="text-[11px] text-slate-500">{submission.email}</div>
                          {submission.phone && <div className="text-[11px] text-slate-400">{submission.phone}</div>}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-[11px] font-semibold bg-blue-50 text-blue-900 border-blue-200">
                          {submission.test_name}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="font-black text-sm text-blue-800 bg-blue-100/60 px-2.5 py-1 rounded-lg">
                          {submission.score}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs text-slate-700 font-medium">{submission.institution || "—"}</div>
                        <div className="text-[11px] text-slate-400">{submission.course || "—"}</div>
                      </TableCell>

                      <TableCell className="text-xs text-slate-600">
                        {new Date(
                          new Date(submission.timestamp).getTime() - 8 * 60 * 60 * 1000
                        ).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                      </TableCell>

                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold hover:bg-[#0f2c59] hover:text-white border-slate-300">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Inspect
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="max-w-4xl max-h-[88vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-black text-[#0f2c59]">
                                ATDC Official Candidate Dossier
                              </DialogTitle>
                            </DialogHeader>

                            {/* Candidate Info Header */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                              <div>
                                <span className="text-slate-500 font-bold uppercase text-[10px]">Candidate Full Name</span>
                                <p className="font-bold text-sm text-[#0f2c59]">{submission.name}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 font-bold uppercase text-[10px]">Email Address</span>
                                <p className="font-bold text-slate-800">{submission.email}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 font-bold uppercase text-[10px]">Contact Phone</span>
                                <p className="font-bold text-slate-800">{submission.phone || "—"}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 font-bold uppercase text-[10px]">Institution / Center</span>
                                <p className="font-semibold text-slate-800">{submission.institution || "—"}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 font-bold uppercase text-[10px]">Class / Designation</span>
                                <p className="font-semibold text-slate-800">{submission.course || "—"}</p>
                              </div>
                              <div>
                                <span className="text-slate-500 font-bold uppercase text-[10px]">Gender / Location</span>
                                <p className="font-semibold text-slate-800 capitalize">
                                  {submission.gender || "—"} {submission.city ? `(${submission.city})` : ""}
                                </p>
                              </div>
                            </div>

                            {/* Score Card */}
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0f2c59] to-[#1e40af] text-white flex items-center justify-between">
                              <div>
                                <div className="text-xs uppercase tracking-wider text-blue-200 font-bold">Assessment Battery</div>
                                <h3 className="text-xl font-black text-white mt-0.5">{submission.test_name}</h3>
                              </div>
                              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 text-center border border-white/20 min-w-[100px]">
                                <div className="text-[10px] uppercase text-blue-200 font-bold">Score</div>
                                <div className="text-2xl font-black text-white">{submission.score}</div>
                              </div>
                            </div>

                            {/* Detailed Diagnostic Analysis */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f2c59]">
                                Diagnostic Results &amp; Psychometric Interpretations
                              </h4>

                              {(() => {
                                const parseResult = (res) => {
                                  try {
                                    return typeof res === "string" ? JSON.parse(res) : res;
                                  } catch (e) {
                                    return res;
                                  }
                                };

                                const parsed = parseResult(submission.result);

                                if (typeof parsed === "string") {
                                  return (
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-sm font-semibold text-[#0f2c59]">
                                      {parsed}
                                    </div>
                                  );
                                }

                                if (parsed && typeof parsed === "object") {
                                  return (
                                    <div className="space-y-4">
                                      {parsed.title && (
                                        <div className="font-bold text-base text-[#0f2c59]">
                                          {parsed.title}
                                        </div>
                                      )}
                                      {parsed.description && (
                                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-200">
                                          {parsed.description}
                                        </p>
                                      )}

                                      {/* HGMI Breakdown */}
                                      {parsed.breakdown && Array.isArray(parsed.breakdown) && (
                                        <div className="space-y-4">
                                          <div className="border border-slate-200 rounded-xl overflow-hidden">
                                            <Table className="bg-white text-xs">
                                              <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                  <TableHead className="font-bold text-[#0f2c59]">Dimension</TableHead>
                                                  <TableHead className="font-bold text-right text-[#0f2c59]">Score</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {parsed.breakdown.map((cat, idx) => (
                                                  <TableRow key={idx} className={idx < 3 ? "bg-blue-50/60 font-semibold" : ""}>
                                                    <TableCell>{cat.name}</TableCell>
                                                    <TableCell className="text-right font-bold">{cat.score} pts</TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>

                                          <div className="space-y-3">
                                            <h5 className="font-bold text-xs uppercase tracking-wider text-[#0f2c59]">
                                              Top 3 Recommended Pathways
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              {parsed.breakdown.slice(0, 3).map((cat, idx) => {
                                                const details = HGMI_DETAILS[cat.id] || HGMI_DETAILS[cat.name];
                                                return (
                                                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                                                    <div className="flex items-center gap-1.5 font-bold text-[#0f2c59]">
                                                      <span className="w-5 h-5 rounded-full bg-[#0f2c59] text-white flex items-center justify-center text-[10px]">
                                                        {idx + 1}
                                                      </span>
                                                      <span>{cat.name}</span>
                                                    </div>
                                                    {details && (
                                                      <div className="space-y-1.5 text-slate-600">
                                                        <p className="text-[11px] whitespace-pre-line">{details.characteristics}</p>
                                                        <div className="pt-2 border-t border-slate-200">
                                                          <span className="font-bold text-[#0f2c59] block text-[11px]">Recommended Options:</span>
                                                          <ul className="list-disc list-inside text-[11px] space-y-0.5 mt-1">
                                                            {details.courses.map((c, i) => (
                                                              <li key={i}>{c}</li>
                                                            ))}
                                                          </ul>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Suggestions */}
                                      {parsed.suggestions && Array.isArray(parsed.suggestions) && (
                                        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                                          <h5 className="font-bold text-xs uppercase tracking-wider text-blue-900">
                                            Recommended Next Steps &amp; Suggestions
                                          </h5>
                                          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                                            {parsed.suggestions.map((s, idx) => (
                                              <li key={idx}>{s}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }

                                return <p className="text-xs text-slate-500">No structured diagnostic data available.</p>;
                              })()}
                            </div>

                            {/* Raw Responses Section */}
                            <div className="border-t border-slate-200 pt-4">
                              <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <summary className="cursor-pointer text-xs font-bold text-[#0f2c59]">
                                  View Raw Question Response Vector
                                </summary>
                                {(() => {
                                  try {
                                    const raw = submission.responses ? (typeof submission.responses === "string" ? JSON.parse(submission.responses) : submission.responses) : null;
                                    if (!raw) return <p className="text-xs text-slate-500 mt-2">No individual response array recorded.</p>;
                                    return <pre className="mt-2 max-h-60 overflow-auto rounded-lg bg-white p-3 text-[11px] text-slate-700 border border-slate-200">{JSON.stringify(raw, null, 2)}</pre>;
                                  } catch (e) {
                                    return <p className="text-xs text-rose-600 mt-2">Could not deserialize response data.</p>;
                                  }
                                })()}
                              </details>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500 text-xs sm:text-sm">
                      No assessment submissions match the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredSubmissions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>Rows per page</span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(val) => {
                    setRowsPerPage(Number(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 h-9 bg-slate-50 border-slate-300 rounded-lg text-xs">
                    <SelectValue placeholder={rowsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center space-x-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="h-8 w-8 p-0 rounded-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}