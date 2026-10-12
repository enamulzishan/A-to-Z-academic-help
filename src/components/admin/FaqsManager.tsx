"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  Check,
  X,
  HelpCircle,
  Filter,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
};

const CATEGORIES = ["General", "Research", "PhD", "Payments"];

export function FaqsManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faqs", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data || []);
      } else {
        setError(data.message || "Failed to load FAQs");
      }
    } catch {
      setError("Network error fetching FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      question: "",
      answer: "",
      category: "General",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: FAQ) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
    });
    setIsModalOpen(true);
  };

  // Submit Add / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return;

    setSubmitting(true);
    try {
      if (editingItem) {
        const res = await fetch("/api/admin/faqs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          showToast("FAQ updated ✓");
          setIsModalOpen(false);
          loadFaqs();
        } else {
          alert(data.message || "Update failed");
        }
      } else {
        const res = await fetch("/api/admin/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          showToast("FAQ created ✓");
          setIsModalOpen(false);
          loadFaqs();
        } else {
          alert(data.message || "Creation failed");
        }
      }
    } catch {
      alert("Error saving FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("FAQ deleted ✓");
        setDeleteConfirmId(null);
        loadFaqs();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch {
      alert("Error deleting FAQ");
    }
  };

  // Move Up / Down
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const list = [...faqs];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const updatedWithOrder = list.map((f, idx) => ({
      ...f,
      display_order: idx + 1,
    }));

    setFaqs(updatedWithOrder);

    try {
      await fetch("/api/admin/faqs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: updatedWithOrder.map((f) => ({ id: f.id, display_order: f.display_order })),
        }),
      });
      showToast("Order saved ✓");
    } catch {
      showToast("Failed to save order");
    }
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All" || faq.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage FAQs across categories and organize their order for the public FAQ section.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md shadow-amber-500/10 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by question or answer..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-amber-400 text-slate-950"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
          <p className="text-xs">Loading FAQs from Supabase...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 text-center text-slate-400">
          <HelpCircle className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-semibold text-white">No FAQs Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "All"
              ? "Try adjusting your search query or category filter."
              : 'Click "Add FAQ" to create your first question and answer.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isFirst = index === 0;
            const isLast = index === filteredFaqs.length - 1;
            const isExpanded = expandedFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all"
              >
                <div className="flex items-start sm:items-center justify-between gap-4">
                  {/* Left: Reorder & Question */}
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div className="flex flex-col gap-1 items-center shrink-0">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={isFirst}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-500">#{index + 1}</span>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={isLast}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {faq.category}
                        </span>
                      </div>
                      <h3
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="font-bold text-white text-sm sm:text-base cursor-pointer hover:text-amber-400 transition-colors"
                      >
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title={isExpanded ? "Collapse Answer" : "Expand Answer"}
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => openEditModal(faq)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(faq.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Answer Body */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingItem ? "Edit FAQ" : "Add New FAQ"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. Do you guarantee a specific grade?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Answer *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Write clear, comprehensive answer here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Save Changes" : "Create FAQ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">Delete FAQ?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to remove this question? It will no longer show on the FAQ page.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
