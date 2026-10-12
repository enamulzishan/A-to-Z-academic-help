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
    .from('faqs')
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
    const { question, answer, category } = body;

    if (!question || !answer || !category) {
      return NextResponse.json({ success: false, message: 'Question, Answer, and Category are required' }, { status: 400 });
    }

    const { data: maxOrderData } = await client
      .from('faqs')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = (maxOrderData?.[0]?.display_order ?? 0) + 1;

    const { data, error } = await client
      .from('faqs')
      .insert([
        {
          question,
          answer,
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
    const { id, question, answer, category, display_order } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await client
      .from('faqs')
      .update({
        question,
        answer,
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

  const { error } = await client.from('faqs').delete().eq('id', id);

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
    const { items } = await request.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, message: 'Items array is required' }, { status: 400 });
    }

    for (const item of items) {
      await client
        .from('faqs')
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
