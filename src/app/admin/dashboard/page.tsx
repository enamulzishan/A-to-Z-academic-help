"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Mail,
  Phone,
  Clock,
  BookOpen,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Copy,
  DownloadCloud,
  MessageSquare,
  Shield,
  Layers,
  ArrowUpDown,
  Users,
  HelpCircle,
  FileText,
  Loader2
} from "lucide-react";
import type { ContactSubmission, ChecklistDownload, GoogleSheetsData } from "@/lib/googleSheets";
import { TeamManager } from "@/components/admin/TeamManager";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { FaqsManager } from "@/components/admin/FaqsManager";
import { BlogPostsManager } from "@/components/admin/BlogPostsManager";

type AdminSection = "submissions" | "team" | "testimonials" | "faqs" | "blog";

function DashboardContent({ defaultSection = "submissions" }: { defaultSection?: AdminSection }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const querySection = searchParams.get("tab") as AdminSection | null;

  // Navigation section
  const [activeSection, setActiveSection] = useState<AdminSection>(
    querySection || defaultSection || "submissions"
  );

  // Sync if query param changes
  useEffect(() => {
    if (querySection) {
      setActiveSection(querySection);
    }
  }, [querySection]);

  // Data states
  const [data, setData] = useState<GoogleSheetsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Filter & Search states (for submissions)
  const [activeTab, setActiveTab] = useState<"contacts" | "checklists">("contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");

  // Interaction states
  const [expandedMessages, setExpandedMessages] = useState<Record<number, boolean>>({});
  const [updatingRow, setUpdatingRow] = useState<number | null>(null);
  const [updateFeedback, setUpdateFeedback] = useState<{ row: number; text: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Fetch submissions from API
  const loadSubmissions = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/submissions", { cache: "no-store" });
      if (res.ok) {
        const json: GoogleSheetsData = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeSection === "submissions") {
      loadSubmissions();
    }
  }, [activeSection]);

  // Logout handler
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  // Status update handler for Contact Submissions
  const handleStatusChange = async (rowIndex: number, newStatus: string) => {
    setUpdatingRow(rowIndex);
    setUpdateFeedback(null);

    // Optimistically update local state
    if (data?.contacts) {
      setData({
        ...data,
        contacts: data.contacts.map((c) =>
          c.rowIndex === rowIndex ? { ...c, status: newStatus } : c
        ),
      });
    }

    try {
      const res = await fetch("/api/admin/submissions/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex, status: newStatus }),
      });

      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setUpdateFeedback({ row: rowIndex, text: "Saved to Sheet ✓" });
      } else {
        setUpdateFeedback({
          row: rowIndex,
          text: data?.configured ? "Update failed" : "Updated in Preview (Sheet not linked)",
        });
      }
    } catch {
      setUpdateFeedback({ row: rowIndex, text: "Network error" });
    } finally {
      setUpdatingRow(null);
      setTimeout(() => setUpdateFeedback(null), 3000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const toggleMessageExpand = (rowIndex: number) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  // Filtered & Sorted Contacts
  const filteredContacts = useMemo(() => {
    if (!data?.contacts) return [];

    let list = [...data.contacts];

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((c) => c.status?.toLowerCase().includes(statusFilter.toLowerCase()));
    }

    // Search query (name or email or subject)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.fullName?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.subject?.toLowerCase().includes(q) ||
          c.academicLevel?.toLowerCase().includes(q)
      );
    }

    // Sort order
    list.sort((a, b) => {
      if (sortOrder === "recent") {
        return b.rowIndex - a.rowIndex;
      }
      return a.rowIndex - b.rowIndex;
    });

    return list;
  }, [data?.contacts, statusFilter, searchQuery, sortOrder]);

  // Filtered & Sorted Checklists
  const filteredChecklists = useMemo(() => {
    if (!data?.checklists) return [];

    let list = [...data.checklists];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.email?.toLowerCase().includes(q) ||
          item.sourcePage?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortOrder === "recent") {
        return b.rowIndex - a.rowIndex;
      }
      return a.rowIndex - b.rowIndex;
    });

    return list;
  }, [data?.checklists, searchQuery, sortOrder]);

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s.includes("new")) {
      return {
        bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        label: "🔴 New",
      };
    }
    if (s.includes("progress")) {
      return {
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        label: "🟡 In Progress",
      };
    }
    if (s.includes("responded")) {
      return {
        bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        label: "🟢 Responded",
      };
    }
    return {
      bg: "bg-slate-700/50 border-slate-600 text-slate-300",
      label: status || "New",
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shadow-sm">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">
                  A to Z <span className="text-amber-400">Academic Help</span>
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/20">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {activeSection === "submissions" && (
              <button
                onClick={() => loadSubmissions(true)}
                disabled={refreshing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                title="Refresh submissions from Google Sheets"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-400" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-2 py-2">
            <button
              onClick={() => setActiveSection("submissions")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeSection === "submissions"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Form Submissions</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900/60 text-slate-200 border border-slate-700/50">
                Google Sheets
              </span>
            </button>

            <button
              onClick={() => setActiveSection("team")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeSection === "team"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team Members</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900/60 text-slate-200 border border-slate-700/50">
                Supabase
              </span>
            </button>

            <button
              onClick={() => setActiveSection("testimonials")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeSection === "testimonials"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Testimonials</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900/60 text-slate-200 border border-slate-700/50">
                Supabase
              </span>
            </button>

            <button
              onClick={() => setActiveSection("faqs")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeSection === "faqs"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQs</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900/60 text-slate-200 border border-slate-700/50">
                Supabase
              </span>
            </button>

            <button
              onClick={() => setActiveSection("blog")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeSection === "blog"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Articles & Blog</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900/60 text-slate-200 border border-slate-700/50">
                Supabase
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Render Team Section */}
        {activeSection === "team" && <TeamManager />}

        {/* Render Testimonials Section */}
        {activeSection === "testimonials" && <TestimonialsManager />}

        {/* Render FAQs Section */}
        {activeSection === "faqs" && <FaqsManager />}

        {/* Render Blog Section */}
        {activeSection === "blog" && <BlogPostsManager />}

        {/* Render Submissions Section (Option A: Google Sheets Live Sync) */}
        {activeSection === "submissions" && (
          <div>
            {/* Header Summary & Tab Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Submissions Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  View student enquiries, filter by status, and update records synchronized with your Google Sheet.
                </p>
              </div>

              {/* Sub-Tab Buttons */}
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setActiveTab("contacts")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "contacts"
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Enquiries</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === "contacts"
                        ? "bg-slate-900 text-amber-300"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {data?.contacts?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("checklists")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "checklists"
                      ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Checklist Downloads</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === "checklists"
                        ? "bg-slate-900 text-amber-300"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {data?.checklists?.length || 0}
                  </span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeTab === "contacts"
                        ? "Search by student name, email, or subject..."
                        : "Search by email or source page..."
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Filter and Sorting Controls */}
                <div className="flex items-center gap-2">
                  {activeTab === "contacts" && (
                    <div className="relative flex items-center">
                      <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-8 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="new">🔴 New Only</option>
                        <option value="progress">🟡 In Progress</option>
                        <option value="responded">🟢 Responded</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 pointer-events-none" />
                    </div>
                  )}

                  <button
                    onClick={() => setSortOrder(sortOrder === "recent" ? "oldest" : "recent")}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
                    title="Toggle sorting direction"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">
                      {sortOrder === "recent" ? "Newest First" : "Oldest First"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submissions List Views */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mb-3" />
                <p className="text-sm">Fetching records from Google Sheet...</p>
              </div>
            ) : activeTab === "contacts" ? (
              <div>
                {filteredContacts.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                    <h4 className="text-base font-semibold text-white">No Contact Submissions Found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your search query or status filter."
                        : "No form submissions have been recorded in the Google Sheet yet."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredContacts.map((contact) => {
                      const badge = getStatusBadge(contact.status);
                      const isExpanded = Boolean(expandedMessages[contact.rowIndex]);
                      const isLongMessage = (contact.message || "").length > 180;
                      const isSaving = updatingRow === contact.rowIndex;

                      return (
                        <div
                          key={contact.rowIndex}
                          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800/80">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-lg font-bold text-white tracking-tight">
                                {contact.fullName || "Anonymous Student"}
                              </h3>

                              {contact.academicLevel && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                                  {contact.academicLevel}
                                </span>
                              )}

                              <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {contact.timestamp || "Recently"}
                              </span>
                            </div>

                            {/* Status Picker with Live Google Sheet Sync */}
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <select
                                  value={
                                    contact.status?.toLowerCase().includes("responded")
                                      ? "🟢 Responded"
                                      : contact.status?.toLowerCase().includes("progress")
                                      ? "🟡 In Progress"
                                      : "🔴 New"
                                  }
                                  disabled={isSaving}
                                  onChange={(e) =>
                                    handleStatusChange(contact.rowIndex, e.target.value)
                                  }
                                  className={`text-xs font-semibold rounded-xl pl-3 pr-8 py-1.5 border appearance-none cursor-pointer focus:outline-none transition-all ${badge.bg}`}
                                >
                                  <option value="🔴 New" className="bg-slate-900 text-white">
                                    🔴 New
                                  </option>
                                  <option value="🟡 In Progress" className="bg-slate-900 text-white">
                                    🟡 In Progress
                                  </option>
                                  <option value="🟢 Responded" className="bg-slate-900 text-white">
                                    🟢 Responded
                                  </option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                              </div>

                              {isSaving && (
                                <span className="text-[11px] text-amber-400 animate-pulse font-mono">
                                  Saving...
                                </span>
                              )}

                              {updateFeedback?.row === contact.rowIndex && (
                                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5">
                                  <Check className="w-3 h-3" />
                                  {updateFeedback.text}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-xs">
                            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                                <a
                                  href={`mailto:${contact.email}`}
                                  className="text-slate-200 hover:text-amber-300 truncate"
                                >
                                  {contact.email}
                                </a>
                              </div>
                              <button
                                onClick={() => copyToClipboard(contact.email)}
                                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                                title="Copy email address"
                              >
                                {copiedEmail === contact.email ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                {contact.phone ? (
                                  <a
                                    href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-slate-200 hover:text-emerald-300 truncate"
                                  >
                                    {contact.phone}
                                  </a>
                                ) : (
                                  <span className="text-slate-500 italic">Not provided</span>
                                )}
                              </div>
                              {contact.phone && (
                                <button
                                  onClick={() => copyToClipboard(contact.phone)}
                                  className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                                  title="Copy phone number"
                                >
                                  {copiedEmail === contact.phone ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center gap-2 sm:col-span-2 md:col-span-1">
                              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                              <div className="overflow-hidden">
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">
                                  Research Area
                                </span>
                                <span className="text-slate-200 font-medium truncate block">
                                  {contact.subject || "General Consultation"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/80">
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                              <span>Student Message</span>
                              {contact.sourcePage && (
                                <span className="text-[11px] text-slate-500 font-mono normal-case">
                                  via: {contact.sourcePage}
                                </span>
                              )}
                            </div>

                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                              {isExpanded || !isLongMessage
                                ? contact.message
                                : `${contact.message?.slice(0, 180)}...`}
                            </p>

                            {isLongMessage && (
                              <button
                                onClick={() => toggleMessageExpand(contact.rowIndex)}
                                className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
                              >
                                {isExpanded ? (
                                  <>
                                    <span>Show less</span>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </>
                                ) : (
                                  <>
                                    <span>Read full message</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                            <span>Sheet Row #{contact.rowIndex}</span>
                            <span>Tab: Contact Submissions</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Checklist Downloads View */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">Checklist Lead Submissions</h3>
                    <p className="text-xs text-slate-400">
                      Prospective students who downloaded the Free Proposal Checklist.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
                    {filteredChecklists.length} Downloads
                  </span>
                </div>

                {filteredChecklists.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <FileCheck className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                    <h4 className="text-base font-semibold text-white">No Checklist Downloads Found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {searchQuery
                        ? "No downloads match your search query."
                        : 'No checklist download leads found. Add a tab named "Checklist Downloads" to your Google Sheet to track them separately.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                          <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                          <th className="py-3.5 px-4 sm:px-6">Lead Email</th>
                          <th className="py-3.5 px-4 sm:px-6">Source Page</th>
                          <th className="py-3.5 px-4 sm:px-6 text-right">Row #</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-xs">
                        {filteredChecklists.map((item) => (
                          <tr
                            key={item.rowIndex}
                            className="hover:bg-slate-850/50 transition-colors"
                          >
                            <td className="py-4 px-4 sm:px-6 text-slate-300 font-mono flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>{item.timestamp || "Recently"}</span>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`mailto:${item.email}`}
                                  className="font-medium text-slate-100 hover:text-amber-400 transition-colors"
                                >
                                  {item.email}
                                </a>
                                <button
                                  onClick={() => copyToClipboard(item.email)}
                                  className="text-slate-500 hover:text-slate-300 transition-colors"
                                  title="Copy email"
                                >
                                  {copiedEmail === item.email ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
                                {item.sourcePage || "/"}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-right font-mono text-slate-500 text-[11px]">
                              #{item.rowIndex}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
