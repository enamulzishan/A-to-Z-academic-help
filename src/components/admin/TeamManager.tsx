"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Loader2,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  User,
  GraduationCap
} from "lucide-react";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  qualification: string | null;
  university: string | null;
  subject_expertise: string | null;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  category: string;
  display_order: number;
};

const CATEGORIES = [
  { id: "academic-consultant", label: "Academic Consultant" },
  { id: "research-consultant", label: "Research Consultant" },
  { id: "subject-specialist", label: "Subject Specialist" },
  { id: "academic-editor", label: "Academic Editor" },
];

export function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    qualification: "",
    university: "",
    subject_expertise: "",
    bio: "",
    photo_url: "",
    linkedin_url: "",
    category: "academic-consultant",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setMembers(data.data || []);
      } else {
        setError(data.message || "Failed to load team members");
      }
    } catch {
      setError("Network error fetching team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      qualification: "",
      university: "",
      subject_expertise: "",
      bio: "",
      photo_url: "",
      linkedin_url: "",
      category: "academic-consultant",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name || "",
      role: member.role || "",
      qualification: member.qualification || "",
      university: member.university || "",
      subject_expertise: member.subject_expertise || "",
      bio: member.bio || "",
      photo_url: member.photo_url || "",
      linkedin_url: member.linkedin_url || "",
      category: member.category || "academic-consultant",
    });
    setIsModalOpen(true);
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData((prev) => ({ ...prev, photo_url: data.url }));
        showToast("Image uploaded to Supabase Storage ✓");
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    setSubmitting(true);
    try {
      if (editingMember) {
        // Update
        const res = await fetch("/api/admin/team", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingMember.id, ...formData }),
        });
        const data = await res.json();
        if (data.success) {
          showToast("Team member updated successfully ✓");
          setIsModalOpen(false);
          loadMembers();
        } else {
          alert(data.message || "Update failed");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          showToast("Team member added successfully ✓");
          setIsModalOpen(false);
          loadMembers();
        } else {
          alert(data.message || "Failed to add member");
        }
      }
    } catch {
      alert("Error saving team member");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Team member deleted ✓");
        setDeleteConfirmId(null);
        loadMembers();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch {
      alert("Error deleting member");
    }
  };

  // Move Up / Down Reorder
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const newMembers = [...members];
    const [moved] = newMembers.splice(index, 1);
    newMembers.splice(targetIndex, 0, moved);

    // Re-assign display_order
    const updatedWithOrder = newMembers.map((m, idx) => ({
      ...m,
      display_order: idx + 1,
    }));

    setMembers(updatedWithOrder);

    // Save to server
    try {
      await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: updatedWithOrder.map((m) => ({ id: m.id, display_order: m.display_order })),
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

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Academic Team Members</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage consultants, qualifications, photos, and live site display order.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md shadow-amber-500/10 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
          <p className="text-xs">Loading team members from Supabase...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 text-center text-slate-400">
          <User className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-semibold text-white">No Team Members Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click &quot;Add Team Member&quot; to create your first consultant profile.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member, index) => {
            const isFirst = index === 0;
            const isLast = index === members.length - 1;

            return (
              <div
                key={member.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
              >
                {/* Left: Reorder & Photo & Info */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  {/* Reorder Up/Down */}
                  <div className="flex flex-col gap-1 items-center shrink-0">
                    <button
                      onClick={() => handleMove(index, "up")}
                      disabled={isFirst}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-slate-500">#{index + 1}</span>
                    <button
                      onClick={() => handleMove(index, "down")}
                      disabled={isLast}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Photo Avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 relative shrink-0">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Member Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {CATEGORIES.find((c) => c.id === member.category)?.label || member.category}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-amber-400 mb-1">{member.role}</p>

                    {member.qualification && (
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{member.qualification}</span>
                      </p>
                    )}

                    {member.bio && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1">{member.bio}</p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => openEditModal(member)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(member.id)}
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Profile Photo (Supabase Storage)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 relative shrink-0">
                    {formData.photo_url ? (
                      <Image
                        src={formData.photo_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer transition-colors">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Uploading to Storage...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-amber-400" />
                          <span>Upload Image File</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1">
                      JPG, PNG, WebP supported. Saved to Supabase bucket.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Sarah Williams"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Research Consultant"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Category */}
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
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Qualification & University */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. PhD in Sociology"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    University / Alma Mater
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="e.g. University of Manchester"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Subject Expertise & LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject Expertise
                  </label>
                  <input
                    type="text"
                    value={formData.subject_expertise}
                    onChange={(e) => setFormData({ ...formData, subject_expertise: e.target.value })}
                    placeholder="e.g. Qualitative Methodology, NVivo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bio / Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief biography outlining experience and doctoral advisory achievements..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
                  <span>{editingMember ? "Save Changes" : "Create Member"}</span>
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

            <h3 className="text-base font-bold text-white mb-2">Delete Team Member?</h3>
            <p className="text-xs text-slate-400 mb-6">
              This action cannot be undone. This consultant will be immediately removed from the live website.
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
