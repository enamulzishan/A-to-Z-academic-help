"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  Loader2,
  AlertCircle,
  Check,
  X,
  FileText,
  Search,
  Eye,
  Code,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Sparkles,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  Clock
} from "lucide-react";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  published: boolean;
  published_at: string | null;
  created_at?: string;
};

const CATEGORIES = [
  "Research Methodology",
  "Dissertation",
  "PhD Guidance",
  "Academic Writing",
  "Literature Review",
  "Data Analysis & Statistics",
];

export function BlogPostsManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Modal / Drawer state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [category, setCategory] = useState("Academic Writing");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  // Editor tab: 'write' vs 'preview'
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setPosts(data.data || []);
      } else {
        setError(data.message || "Failed to load posts");
      }
    } catch {
      setError("Network error fetching blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Auto-generate slug from title if locked
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (isSlugLocked && !editingPost) {
      const generated = newTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  };

  const openNewPost = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setIsSlugLocked(true);
    setCategory("Academic Writing");
    setExcerpt("");
    setContent(
      "## Introduction\n\nWrite your introduction here...\n\n## Key Considerations\n\n- Point 1\n- Point 2\n\n## Conclusion\n\nSummary of findings..."
    );
    setCoverImageUrl("");
    setPublished(true);
    setEditorTab("write");
    setIsEditorOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setIsSlugLocked(false);
    setCategory(post.category || "Academic Writing");
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");
    setCoverImageUrl(post.cover_image_url || "");
    setPublished(post.published);
    setEditorTab("write");
    setIsEditorOpen(true);
  };

  // Image Upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (res.ok && data.success) {
        setCoverImageUrl(data.url);
        showToast("Cover image uploaded to Supabase Storage ✓");
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch {
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Insert markdown helper at cursor
  const insertMarkdown = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);

    const replacement = `${prefix}${selected || "text"}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 0);
  };

  // Save handler (draft or publish)
  const handleSave = async (isPublishOverride?: boolean) => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      alert("Please enter a title, slug, and content.");
      return;
    }

    const isPublished = isPublishOverride !== undefined ? isPublishOverride : published;
    setSubmitting(true);

    const payload = {
      title,
      slug,
      category,
      excerpt,
      content,
      cover_image_url: coverImageUrl || null,
      published: isPublished,
    };

    try {
      if (editingPost) {
        const res = await fetch("/api/admin/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPost.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          showToast(isPublished ? "Article published live ✓" : "Saved as draft ✓");
          setIsEditorOpen(false);
          loadPosts();
        } else {
          alert(data.message || "Failed to update article");
        }
      } else {
        const res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast(isPublished ? "Article published live ✓" : "Saved as draft ✓");
          setIsEditorOpen(false);
          loadPosts();
        } else {
          alert(data.message || "Failed to create article");
        }
      }
    } catch {
      alert("Network error saving post");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Article deleted ✓");
        setDeleteConfirmId(null);
        loadPosts();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch {
      alert("Error deleting article");
    }
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "published"
          ? p.published
          : !p.published;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [posts, statusFilter, searchQuery]);

  return (
    <div>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Blog & Resources Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, and publish research guides and academic advice with live markdown editing.
          </p>
        </div>

        <button
          onClick={openNewPost}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md shadow-amber-500/10 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, slug, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setStatusFilter("published")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "published"
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            🟢 Published ({posts.filter((p) => p.published).length})
          </button>
          <button
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "draft"
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            🟡 Drafts ({posts.filter((p) => !p.published).length})
          </button>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
          <p className="text-xs">Loading articles from Supabase...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl py-16 text-center text-slate-400">
          <FileText className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-semibold text-white">No Articles Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : 'Click "Write New Article" to compose your first blog post.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
            >
              {/* Left: Thumbnail & Title & Meta */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Cover Image */}
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative shrink-0">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-400 bg-amber-500/10">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        post.published
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      }`}
                    >
                      {post.published ? "🟢 Published" : "🟡 Draft"}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      {post.category || "Academic Writing"}
                    </span>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString("en-GB")
                        : "Unpublished"}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base truncate mb-1">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="truncate">slug: /{post.slug}</span>
                    {post.published && (
                      <Link
                        href={`/resources/${post.slug}`}
                        target="_blank"
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => openEditPost(post)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(post.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal / Workspace */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl p-6 shadow-2xl relative max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingPost ? "Edit Article" : "Compose New Article"}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={submitting}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish Article</span>
                </button>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. How to Structure a Ph.D. Literature Review"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      URL Slug *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSlugLocked(!isSlugLocked)}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {isSlugLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{isSlugLocked ? "Auto-synced" : "Custom"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={slug}
                    readOnly={isSlugLocked}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-url-slug"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 ${
                      isSlugLocked ? "opacity-75" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Category & Cover Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cover Image (Supabase Storage)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="https://... image URL or upload"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />

                    <label className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                      {uploadingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A compelling 1-2 sentence preview for search results and article cards..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Markdown Editor Component */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                {/* Editor Toolbar & Tab Switcher */}
                <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                  {/* Markdown Action Buttons */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => insertMarkdown("## ")}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="Heading 2"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("### ")}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="Heading 3"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <span className="w-px h-4 bg-slate-800 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown("**", "**")}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("*", "*")}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("- ")}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("1. ")}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("> ")}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="Quote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("[Link Text](", ")")}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="Insert Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("```\n", "\n```")}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                      title="Code Block"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Write vs Preview Mode Toggle */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditorTab("write")}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        editorTab === "write"
                          ? "bg-amber-400 text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab("preview")}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        editorTab === "preview"
                          ? "bg-amber-400 text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {/* Editor Content Area */}
                {editorTab === "write" ? (
                  <textarea
                    ref={textareaRef}
                    rows={14}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Compose article in Markdown format..."
                    className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y min-h-[350px]"
                  />
                ) : (
                  <div className="p-6 bg-slate-950/70 text-slate-200 min-h-[350px] max-h-[500px] overflow-y-auto leading-relaxed text-sm space-y-4">
                    {content.split("\n\n").map((block, idx) => {
                      if (block.startsWith("## ")) {
                        return (
                          <h2 key={idx} className="text-xl font-bold text-amber-300 pt-2 border-b border-slate-800 pb-1">
                            {block.replace(/^## /, "")}
                          </h2>
                        );
                      }
                      if (block.startsWith("### ")) {
                        return (
                          <h3 key={idx} className="text-lg font-bold text-white pt-1">
                            {block.replace(/^### /, "")}
                          </h3>
                        );
                      }
                      if (block.startsWith("> ")) {
                        return (
                          <blockquote key={idx} className="border-l-4 border-amber-400 pl-4 italic text-slate-300 bg-slate-900/40 py-2 rounded-r">
                            {block.replace(/^> /, "")}
                          </blockquote>
                        );
                      }
                      if (block.startsWith("- ") || block.startsWith("* ")) {
                        return (
                          <ul key={idx} className="list-disc pl-6 space-y-1 text-slate-300">
                            {block.split("\n").map((li, lidx) => (
                              <li key={lidx}>{li.replace(/^[-*]\s+/, "")}</li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={idx} className="text-slate-300 leading-relaxed">
                          {block}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Publish Toggle Footer */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published_toggle"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400 cursor-pointer"
                  />
                  <label htmlFor="published_toggle" className="text-xs text-slate-300 cursor-pointer">
                    Set status to <strong className="text-white">Published</strong> (immediately visible on live /resources)
                  </label>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  {content.trim().split(/\s+/).filter(Boolean).length} words
                </div>
              </div>
            </div>
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

            <h3 className="text-base font-bold text-white mb-2">Delete Blog Post?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to permanently remove this article? Its URL will return a 404.
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
