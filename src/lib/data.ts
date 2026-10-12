import { supabase, isSupabaseConfigured, getAdminSupabase } from './supabase';
import { team as fallbackTeam, TeamMember as FallbackTeamMember } from '@/data/team';
import { testimonials as fallbackTestimonials, Testimonial as FallbackTestimonial } from '@/data/testimonials';
import { faqs as fallbackFaqs, FAQ as FallbackFAQ } from '@/data/faqs';

export type TeamMemberItem = {
  id: string;
  name: string;
  role: string;
  qualification: string;
  university: string;
  subject_expertise: string;
  bio: string;
  image: string;
  photo_url: string;
  linkedin_url?: string;
  category: string;
  display_order: number;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role: string;
  university: string;
  approved: boolean;
  display_order: number;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
};

/**
 * Fetches all team members from Supabase, falling back to static data if needed.
 */
export async function getTeamMembers(): Promise<TeamMemberItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((m) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          qualification: m.qualification || '',
          university: m.university || '',
          subject_expertise: m.subject_expertise || '',
          bio: m.bio || '',
          image: m.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=0A1F44&color=fff&size=200`,
          photo_url: m.photo_url || '',
          linkedin_url: m.linkedin_url || '',
          category: m.category,
          display_order: m.display_order ?? 0,
        }));
      }
    } catch (e) {
      console.warn('Error fetching team members from Supabase, using fallback:', e);
    }
  }

  // Fallback to static data
  return fallbackTeam.map((m, index) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    qualification: m.qualification,
    university: '',
    subject_expertise: '',
    bio: m.bio,
    image: m.image,
    photo_url: m.image,
    category: m.category,
    display_order: index + 1,
  }));
}

/**
 * Fetches approved testimonials for the live site.
 */
export async function getApprovedTestimonials(): Promise<TestimonialItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('approved', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((t) => ({
          id: t.id,
          quote: t.content,
          author: t.student_name,
          role: t.program || 'Student',
          university: t.university || '',
          approved: t.approved,
          display_order: t.display_order ?? 0,
        }));
      }
    } catch (e) {
      console.warn('Error fetching testimonials from Supabase, using fallback:', e);
    }
  }

  // Fallback to static data
  return fallbackTestimonials.map((t, index) => ({
    id: t.id,
    quote: t.quote,
    author: t.author,
    role: t.role,
    university: t.university,
    approved: true,
    display_order: index + 1,
  }));
}

/**
 * Fetches all FAQs for the live site.
 */
export async function getFAQs(): Promise<FAQItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          category: f.category,
          display_order: f.display_order ?? 0,
        }));
      }
    } catch (e) {
      console.warn('Error fetching FAQs from Supabase, using fallback:', e);
    }
  }

  // Fallback to static data
  return fallbackFaqs.map((f, index) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
    display_order: index + 1,
  }));
}

export type BlogPostItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  cover_image_url?: string | null;
  published: boolean;
};

function calculateReadTime(text: string): string {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function formatDate(isoOrDate: string | null | undefined): string {
  if (!isoOrDate) return 'Recently';
  try {
    return new Date(isoOrDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

/**
 * Fetches all published blog posts for the resources index.
 */
export async function getPublishedBlogPosts(): Promise<BlogPostItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          date: formatDate(p.published_at || p.created_at),
          category: p.category || 'Academic Writing',
          readTime: calculateReadTime(p.content || ''),
          excerpt: p.excerpt || (p.content ? p.content.slice(0, 160) + '...' : ''),
          content: p.content,
          cover_image_url: p.cover_image_url || null,
          published: p.published,
        }));
      }
    } catch (e) {
      console.warn('Error fetching blog posts from Supabase, using fallback:', e);
    }
  }

  // Fallback to local MDX if Supabase fails
  const { getAllPosts } = await import('@/lib/blog');
  return getAllPosts().map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    readTime: p.readTime,
    excerpt: p.excerpt,
    content: p.content,
    cover_image_url: null,
    published: true,
  }));
}

/**
 * Fetches an individual blog post by slug from Supabase (or fallback MDX).
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          slug: data.slug,
          title: data.title,
          date: formatDate(data.published_at || data.created_at),
          category: data.category || 'Academic Writing',
          readTime: calculateReadTime(data.content || ''),
          excerpt: data.excerpt || (data.content ? data.content.slice(0, 160) + '...' : ''),
          content: data.content,
          cover_image_url: data.cover_image_url || null,
          published: data.published,
        };
      }
    } catch (e) {
      console.warn('Error fetching post by slug from Supabase:', e);
    }
  }

  // Fallback to local MDX
  const { getPostBySlug } = await import('@/lib/blog');
  const post = getPostBySlug(slug);
  if (!post) return null;

  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    date: post.date,
    category: post.category,
    readTime: post.readTime,
    excerpt: post.excerpt,
    content: post.content,
    cover_image_url: null,
    published: true,
  };
}

/**
 * Returns all post slugs for generating static params.
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('published', true);

      if (!error && data && data.length > 0) {
        return data.map((d) => d.slug);
      }
    } catch (e) {
      console.warn('Error fetching slugs from Supabase:', e);
    }
  }

  const { getAllPosts } = await import('@/lib/blog');
  return getAllPosts().map((p) => p.slug);
}
