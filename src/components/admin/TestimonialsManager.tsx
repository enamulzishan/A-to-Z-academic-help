"use client";

import { useState, useEffect } from "react";
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
  MessageSquare,
  CheckCircle2,
  EyeOff,
  Quote
} from "lucide-react";

export type Testimonial = {
  id: string;
  student_name: string;
  program: string | null;
  university: string | null;
  content: string;
  approved: boolean;
  display_order: number;
};

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    student_name: "",
    program: "",
    university: "",
    content: "",
    approved: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data || []);
      } else {
        setError(data.message || "Failed to load testimonials");
      }
    } catch {
      setError("Network error fetching testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      student_name: "",
      program: "",
      university: "",
      content: "",
      approved: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      student_name: item.student_name,
      program: item.program || "",
      university: item.university || "",
      content: item.content,
      approved: item.approved,
    });
    setIsModalOpen(true);
  };

  // Toggle Approved Status
  const handleToggleApproved = async (item: Testimonial) => {
    const newStatus = !item.approved;
    setTogglingId(item.id);

    // Optimistically update
    setTestimonials((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, approved: newStatus } : t))
    );

    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, approved: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(newStatus ? "Testimonial Approved & Live ✓" : "Testimonial Hidden from Live Site ✓");
      } else {
        // Rollback
        setTestimonials((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, approved: !newStatus } : t))
        );
        alert(data.message || "Failed to toggle status");
      }
    } catch {
      // Rollback
      setTestimonials((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, approved: !newStatus } : t))
      );
      alert("Network error toggling status");
    } finally {
      setTogglingId(null);
    }
  };

  // Submit Add / Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_name || !formData.content) return;

    setSubmitting(true);
    try {
      if (editingItem) {
        const res = await fetch("/api/admin/testimonials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          showToast("Testimonial updated ✓");
          setIsModalOpen(false);
          loadTestimonials();
        } else {
          alert(data.message || "Update failed");
        }
      } else {
        const res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          showToast("Testimonial created ✓");
          setIsModalOpen(false);
          loadTestimonials();
        } else {
          alert(data.message || "Creation failed");
        }
      }
    } catch {
      alert("Error saving testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Testimonial deleted ✓");
        setDeleteConfirmId(null);
        loadTestimonials();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch {
      alert("Error deleting testimonial");
    }
  };

  // Move Up / Down
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const list = [...testimonials];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const updatedWithOrder = list.map((t, idx) => ({
      ...t,
      display_order: idx + 1,
    }));

    setTestimonials(updatedWithOrder);

    try {
      await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: updatedWithOrder.map((t) => ({ id: t.id, display_order: t.display_order })),
        }),
      });
      showToast("Order saved ✓");
    } catch {
      showToast("Failed to save order");
    }
  };

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
          <h2 className="text-xl font-bold text-white tracking-tight">Student Testimonials</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage student reviews. Only testimonials toggled to &quot;Approved&quot; appear on the live site.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md shadow-amber-500/10 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
          <p className="text-xs">Loading testimonials from Supabase...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 text-center text-slate-400">
          <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-semibold text-white">No Testimonials Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click &quot;Add Testimonial&quot; to publish your first student review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === testimonials.length - 1;
            const isToggling = togglingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
              >
                {/* Left: Reorder & Content */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Reorder Buttons */}
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

                  {/* Content Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-white text-base truncate">{item.student_name}</h3>
                      {item.program && (
                        <span className="text-xs text-amber-400 font-medium">
                          • {item.program}
                        </span>
                      )}
                      {item.university && (
                        <span className="text-xs text-slate-400">
                          ({item.university})
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-2 mt-1">
                      <Quote className="w-3.5 h-3.5 text-amber-400/50 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        &quot;{item.content}&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Approval Switch & Actions */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  {/* Approved Toggle */}
                  <button
                    onClick={() => handleToggleApproved(item)}
                    disabled={isToggling}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      item.approved
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                    title="Click to toggle live site visibility"
                  >
                    {isToggling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : item.approved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{item.approved ? "Approved (Live)" : "Hidden"}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
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
              {editingItem ? "Edit Testimonial" : "Add New Testimonial"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="e.g. Sarah J."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Study Program / Role
                  </label>
                  <input
                    type="text"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    placeholder="e.g. Master's Student"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    University / Institution
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="e.g. University College London"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Review / Testimonial Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the testimonial content here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Approved Checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="approved_checkbox"
                  checked={formData.approved}
                  onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400 cursor-pointer"
                />
                <label htmlFor="approved_checkbox" className="text-xs text-slate-300 cursor-pointer">
                  Approve immediately for display on the live website
                </label>
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
                  <span>{editingItem ? "Save Changes" : "Create Testimonial"}</span>
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

            <h3 className="text-base font-bold text-white mb-2">Delete Testimonial?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to delete this review? This action cannot be reversed.
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
