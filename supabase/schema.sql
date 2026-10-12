-- ==============================================================================
-- A TO Z ACADEMIC HELP - DATABASE INITIALIZATION SCHEMA & SEED SCRIPT
-- Run this script inside your Supabase Project: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLES CREATION
-- ==============================================================================

-- Submissions Table (Contact & Proposal Checklist forms)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    form_type TEXT NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL,
    full_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    academic_level TEXT,
    subject TEXT,
    message TEXT,
    source_page TEXT
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    qualification TEXT,
    university TEXT,
    subject_expertise TEXT,
    bio TEXT,
    photo_url TEXT,
    linkedin_url TEXT,
    category TEXT NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_name TEXT NOT NULL,
    program TEXT,
    university TEXT,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT TRUE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    category TEXT,
    published BOOLEAN DEFAULT TRUE NOT NULL,
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Submissions policies:
-- Anyone can insert a submission from website forms
DROP POLICY IF EXISTS "Allow public form submissions" ON public.submissions;
CREATE POLICY "Allow public form submissions" 
    ON public.submissions FOR INSERT 
    WITH CHECK (true);

-- Allow service_role / authenticated admin full access
DROP POLICY IF EXISTS "Admin full access submissions" ON public.submissions;
CREATE POLICY "Admin full access submissions" 
    ON public.submissions FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Team members policies:
-- Public can read all team members
DROP POLICY IF EXISTS "Public can view team members" ON public.team_members;
CREATE POLICY "Public can view team members" 
    ON public.team_members FOR SELECT 
    USING (true);

-- Admin can manage team members
DROP POLICY IF EXISTS "Admin manage team members" ON public.team_members;
CREATE POLICY "Admin manage team members" 
    ON public.team_members FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Testimonials policies:
-- Public can only view approved testimonials
DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;
CREATE POLICY "Public can view approved testimonials" 
    ON public.testimonials FOR SELECT 
    USING (approved = true);

-- Admin can manage all testimonials
DROP POLICY IF EXISTS "Admin manage testimonials" ON public.testimonials;
CREATE POLICY "Admin manage testimonials" 
    ON public.testimonials FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Blog Posts policies:
-- Public can only view published posts
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" 
    ON public.blog_posts FOR SELECT 
    USING (published = true);

-- Admin can manage all blog posts
DROP POLICY IF EXISTS "Admin manage blog posts" ON public.blog_posts;
CREATE POLICY "Admin manage blog posts" 
    ON public.blog_posts FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- FAQs policies:
-- Public can view all FAQs
DROP POLICY IF EXISTS "Public can view faqs" ON public.faqs;
CREATE POLICY "Public can view faqs" 
    ON public.faqs FOR SELECT 
    USING (true);

-- Admin can manage FAQs
DROP POLICY IF EXISTS "Admin manage faqs" ON public.faqs;
CREATE POLICY "Admin manage faqs" 
    ON public.faqs FOR ALL 
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- 4. STORAGE BUCKET CONFIGURATION (Public bucket for images)
-- ==============================================================================

-- Create bucket 'images' if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view/download images
DROP POLICY IF EXISTS "Public image read access" ON storage.objects;
CREATE POLICY "Public image read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'images');

-- Admin / service role can upload images
DROP POLICY IF EXISTS "Service role upload images" ON storage.objects;
CREATE POLICY "Service role upload images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Service role update images" ON storage.objects;
CREATE POLICY "Service role update images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Service role delete images" ON storage.objects;
CREATE POLICY "Service role delete images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'images');

-- ==============================================================================
-- 5. SEED DATA (Migrated from existing codebase)
-- ==============================================================================

-- Team Members Initial Seed
INSERT INTO public.team_members (name, role, qualification, university, subject_expertise, bio, photo_url, linkedin_url, category, display_order)
VALUES
('Dr. Sarah Williams', 'Senior Research Consultant', 'PhD in Sociology, University of Manchester', 'University of Manchester', 'Qualitative Methods, Social Sciences', 'Dr. Williams specializes in qualitative research methods and has guided over 50 doctoral candidates through their thesis structure and methodology.', 'https://ui-avatars.com/api/?name=Sarah+Williams&background=0A1F44&color=fff&size=200', NULL, 'research-consultant', 1),
('Dr. David Chen', 'Academic Consultant', 'DBA, Warwick Business School', 'Warwick Business School', 'Business Management, Finance', 'With a background in international business, Dr. Chen helps MBA and DBA students formulate robust business models and data analysis strategies.', 'https://ui-avatars.com/api/?name=David+Chen&background=0A1F44&color=fff&size=200', NULL, 'academic-consultant', 2),
('Emma Thompson', 'Senior Academic Editor', 'MA Applied Linguistics, UCL', 'University College London', 'Linguistics, Referencing & Proofreading', 'Emma is our referencing expert, ensuring every paper meets rigorous academic standards across Harvard, APA, and MLA styles.', 'https://ui-avatars.com/api/?name=Emma+Thompson&background=C9A227&color=fff&size=200', NULL, 'academic-editor', 3),
('Dr. Michael Roberts', 'STEM Subject Specialist', 'PhD in Data Science, Imperial College London', 'Imperial College London', 'Data Science, Computer Science, Statistics', 'Dr. Roberts provides specialized guidance for computer science and engineering students, focusing on quantitative methodology and algorithms.', 'https://ui-avatars.com/api/?name=Michael+Roberts&background=0A1F44&color=fff&size=200', NULL, 'subject-specialist', 4),
('Dr. Elena Patel', 'Research Consultant', 'PhD in Psychology, King''s College London', 'King''s College London', 'Experimental Psychology, SPSS & R', 'Dr. Patel specializes in experimental design and advanced statistical analysis, helping students navigate SPSS and R with confidence.', 'https://ui-avatars.com/api/?name=Elena+Patel&background=0A1F44&color=fff&size=200', NULL, 'research-consultant', 5),
('James Wilson', 'Academic Consultant', 'MSc Economics, LSE', 'London School of Economics', 'Economics, Quantitative Research', 'James assists undergraduate and master''s students in structuring their dissertations and developing strong, critical arguments.', 'https://ui-avatars.com/api/?name=James+Wilson&background=C9A227&color=fff&size=200', NULL, 'academic-consultant', 6)
ON CONFLICT DO NOTHING;

-- Testimonials Initial Seed
INSERT INTO public.testimonials (student_name, program, university, content, approved, display_order)
VALUES
('Sarah J.', 'Master''s Student', 'University College London', 'The research guidance helped me understand exactly how to structure my proposal and develop my research questions. Highly recommended for any postgraduate student feeling lost.', true, 1),
('Mark T.', 'PhD Candidate', 'University of Manchester', 'Professional, clear, and incredibly helpful. The support I received for my PhD methodology chapter gave me the confidence I needed for my Viva.', true, 2),
('Elena R.', 'Undergraduate Student', 'King''s College London', 'The academic editing service transformed my dissertation. They didn''t just fix typos; they improved the academic tone and flow significantly.', true, 3),
('David L.', 'DBA Candidate', 'Warwick Business School', 'I was struggling to narrow down my DBA topic. The consultation I had was a game-changer and set me on a clear, focused path.', true, 4)
ON CONFLICT DO NOTHING;

-- FAQs Initial Seed
INSERT INTO public.faqs (question, answer, category, display_order)
VALUES
('Do you guarantee a specific grade?', 'No. Our service is designed to provide professional academic support, guidance, and editing. We do not write papers for students to submit as their own (contract cheating), and therefore we cannot guarantee a specific grade. Our goal is to help you improve your own academic skills.', 'General', 1),
('How quickly can you review my essay?', 'Our standard turnaround time is 3-5 working days. However, we do offer express services (24-48 hours) subject to consultant availability and an additional fee.', 'General', 2),
('Are your consultants based in the UK?', 'Yes, all our academic consultants have been educated at or have taught at UK universities, ensuring they are fully familiar with UK marking criteria and academic standards.', 'General', 3),
('Can you help me choose a research topic?', 'Absolutely. We offer topic ideation consultations where we discuss your interests, review recent literature in your field, and help you identify a viable research gap.', 'Research', 4),
('Do you provide help with data analysis like SPSS or NVivo?', 'Yes, we have specialists in both quantitative (SPSS, R, Stata) and qualitative (NVivo, thematic) analysis who can guide you through the process of analyzing your data.', 'Research', 5),
('Will you write my methodology chapter for me?', 'No. We provide comprehensive guidance, structural advice, and editing. We will help you understand which methodology to choose and how to justify it, but you must write the chapter yourself.', 'Research', 6),
('Do you offer mock Vivas?', 'Yes, we offer mock Viva sessions conducted by consultants who hold PhDs. These sessions simulate the real exam environment and provide constructive feedback on your defense.', 'PhD', 7),
('Can you help me restructure my thesis after a ''Revise and Resubmit''?', 'Yes. Post-Viva corrections can be daunting. We help you systematically address the examiners'' feedback and restructure your thesis to meet their requirements.', 'PhD', 8),
('How does the payment process work?', 'Once we agree on a support plan, we will send you a secure invoice. We require a 50% deposit before work commences, with the remaining balance due upon completion.', 'Payments', 9),
('Do you offer installment plans for PhD support?', 'Yes, for long-term doctoral support, we can arrange customized monthly retainer packages or milestone-based installment plans.', 'Payments', 10)
ON CONFLICT DO NOTHING;
