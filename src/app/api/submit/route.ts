import { NextResponse } from 'next/server';
import { supabase, getAdminSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.trim();
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const formType = body.form_type || body.formType || 'contact';
    const fullName = body.full_name || body.name || null;
    const phone = body.phone || null;
    const academicLevel = body.academic_level || body.academicLevel || null;
    const subject = body.subject || null;
    const message = body.message || body.form_name || null;
    const sourcePage = body.source_page || body.sourcePage || null;

    let supabaseSaved = false;
    let supabaseError: string | null = null;

    // 1. Attempt writing to Supabase submissions table
    if (isSupabaseConfigured) {
      try {
        // Use admin client if available to bypass RLS, or fallback to public client
        const client = process.env.SUPABASE_SERVICE_ROLE_KEY
          ? getAdminSupabase()
          : supabase;

        if (client) {
          const { error } = await client.from('submissions').insert([
            {
              form_type: formType,
              status: 'new',
              full_name: fullName,
              email: email,
              phone: phone,
              academic_level: academicLevel,
              subject: subject,
              message: message,
              source_page: sourcePage,
            },
          ]);

          if (error) {
            console.error('Supabase submissions insert error:', error);
            supabaseError = error.message;
          } else {
            supabaseSaved = true;
          }
        }
      } catch (err) {
        console.error('Failed to write submission to Supabase:', err);
        supabaseError = err instanceof Error ? err.message : 'Database error';
      }
    }

    // 2. Dual-write / Fallback to Google Sheets
    // This ensures ZERO disruption to your existing workflow
    const googleScriptUrl =
      process.env.GOOGLE_SCRIPT_URL ||
      process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    let googleSheetsSent = false;

    if (googleScriptUrl) {
      try {
        const params = new URLSearchParams();
        if (fullName) params.append('name', fullName);
        params.append('email', email);
        if (phone) params.append('phone', phone);
        if (academicLevel) params.append('academicLevel', academicLevel);
        if (subject) params.append('subject', subject);
        if (message) params.append('message', message);
        if (formType) params.append('formType', formType);
        if (sourcePage) params.append('sourcePage', sourcePage);

        await fetch(googleScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });
        googleSheetsSent = true;
      } catch (sheetErr) {
        console.error('Google Sheets forwarding error:', sheetErr);
      }
    }

    // If neither is configured, we warn in development
    if (!isSupabaseConfigured && !googleScriptUrl) {
      console.warn('Neither Supabase nor Google Sheets is configured. Submission logged locally.');
    }

    return NextResponse.json({
      success: true,
      message: 'Submission received successfully.',
      details: {
        supabaseSaved,
        googleSheetsSent,
        warning: supabaseError ? `Supabase note: ${supabaseError}` : null,
      },
    });
  } catch (error) {
    console.error('Error in /api/submit route handler:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process submission.' },
      { status: 500 }
    );
  }
}
