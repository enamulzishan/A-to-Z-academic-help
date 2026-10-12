import { NextResponse } from 'next/server';
import { getAdminSupabase, supabase } from '@/lib/supabase';

function getClient() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ? getAdminSupabase() : supabase;
}

export async function GET() {
  const client = getClient();
  if (!client) {
    return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 });
  }

  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const client = getClient();
  if (!client) {
    return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, cover_image_url, category, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ success: false, message: 'Title, Slug, and Content are required' }, { status: 400 });
    }

    // Clean slug
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const publishedAt = published ? new Date().toISOString() : null;

    const { data, error } = await client
      .from('blog_posts')
      .insert([
        {
          title,
          slug: cleanSlug,
          excerpt: excerpt || null,
          content,
          cover_image_url: cover_image_url || null,
          category: category || 'Academic Writing',
          published: Boolean(published),
          published_at: publishedAt,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const client = getClient();
  if (!client) {
    return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, title, slug, excerpt, content, cover_image_url, category, published } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const cleanSlug = slug
      ? slug
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      : undefined;

    // Check existing post for published_at
    const { data: existingPost } = await client
      .from('blog_posts')
      .select('published, published_at')
      .eq('id', id)
      .single();

    let publishedAt = existingPost?.published_at;
    if (published && !existingPost?.published_at) {
      publishedAt = new Date().toISOString();
    }

    const { data, error } = await client
      .from('blog_posts')
      .update({
        title,
        ...(cleanSlug ? { slug: cleanSlug } : {}),
        excerpt: excerpt || null,
        content,
        cover_image_url: cover_image_url || null,
        category: category || 'Academic Writing',
        published: Boolean(published),
        published_at: publishedAt,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const client = getClient();
  if (!client) {
    return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
  }

  const { error } = await client.from('blog_posts').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
