import { NextResponse } from 'next/server';
import { getAdminSupabase, supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? getAdminSupabase() : supabase;
    if (!client) {
      return NextResponse.json({ success: false, message: 'Supabase client not configured' }, { status: 500 });
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.[^/.]+$/, '');
    const fileName = `${Date.now()}-${cleanFileName}.${fileExt}`;
    const filePath = `team/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await client.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ success: false, message: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = client.storage
      .from('images')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      fileName,
    });
  } catch (error) {
    console.error('Upload exception:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
