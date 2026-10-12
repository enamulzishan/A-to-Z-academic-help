import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((l) => {
  const m = l.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
});

const client = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data: existing, error } = await client.from('blog_posts').select('id, title, slug');
  if (error) {
    console.error('Error fetching blog posts:', error.message);
    return;
  }

  console.log(`Current blog posts in Supabase: ${existing?.length || 0}`);

  if (existing && existing.length === 0) {
    console.log('Seeding existing MDX posts into Supabase...');
    const blogDir = path.resolve(process.cwd(), 'src/content/blog');
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx'));

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const { data: frontmatter, content } = matter(raw);

      const { error: insertErr } = await client.from('blog_posts').insert([
        {
          title: frontmatter.title,
          slug,
          excerpt: frontmatter.excerpt || null,
          content: content.trim(),
          category: frontmatter.category || 'Academic Writing',
          published: true,
          published_at: frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString(),
          cover_image_url: null,
        },
      ]);

      if (insertErr) {
        console.error(`Failed to seed ${slug}:`, insertErr.message);
      } else {
        console.log(`Seeded post: "${frontmatter.title}" (${slug})`);
      }
    }
  }
}

run();
