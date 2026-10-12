import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Public Supabase client for client-side and public queries.
 * Safe to use in browser components and public pages.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Server-side Supabase client with elevated privileges (service role).
 * Use only in server actions or API route handlers (never expose to client).
 */
export const getAdminSupabase = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL or Service Role Key is not configured in environment variables.');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export type SubmissionRow = {
  id: string;
  created_at: string;
  form_type: string;
  status: 'new' | 'in_progress' | 'contacted' | 'closed';
  full_name: string | null;
  email: string;
  phone: string | null;
  academic_level: string | null;
  subject: string | null;
  message: string | null;
  source_page: string | null;
};

export type TeamMemberRow = {
  id: string;
  created_at: string;
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

export type TestimonialRow = {
  id: string;
  created_at: string;
  student_name: string;
  program: string | null;
  university: string | null;
  content: string;
  approved: boolean;
  display_order: number;
};

export type BlogPostRow = {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  published: boolean;
  published_at: string | null;
};

export type FAQRow = {
  id: string;
  created_at: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
};
