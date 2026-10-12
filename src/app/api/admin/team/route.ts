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
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

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
    const { name, role, qualification, university, subject_expertise, bio, photo_url, linkedin_url, category } = body;

    if (!name || !role || !category) {
      return NextResponse.json({ success: false, message: 'Name, Role, and Category are required' }, { status: 400 });
    }

    // Determine next display_order
    const { data: maxOrderData } = await client
      .from('team_members')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = (maxOrderData?.[0]?.display_order ?? 0) + 1;

    const { data, error } = await client
      .from('team_members')
      .insert([
        {
          name,
          role,
          qualification: qualification || null,
          university: university || null,
          subject_expertise: subject_expertise || null,
          bio: bio || null,
          photo_url: photo_url || null,
          linkedin_url: linkedin_url || null,
          category,
          display_order: nextOrder,
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
    const { id, name, role, qualification, university, subject_expertise, bio, photo_url, linkedin_url, category, display_order } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await client
      .from('team_members')
      .update({
        name,
        role,
        qualification: qualification || null,
        university: university || null,
        subject_expertise: subject_expertise || null,
        bio: bio || null,
        photo_url: photo_url || null,
        linkedin_url: linkedin_url || null,
        category,
        ...(display_order !== undefined ? { display_order } : {}),
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

  const { error } = await client.from('team_members').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const client = getClient();
  if (!client) {
    return NextResponse.json({ success: false, message: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { items } = await request.json(); // Array of { id, display_order }
    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, message: 'Items array is required' }, { status: 400 });
    }

    for (const item of items) {
      await client
        .from('team_members')
        .update({ display_order: item.display_order })
        .eq('id', item.id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
