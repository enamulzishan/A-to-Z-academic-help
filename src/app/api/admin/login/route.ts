import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createSessionToken, verifyAdminPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid password. Access denied.' },
        { status: 401 }
      );
    }

    // 7 days expiration (168 hours)
    const sessionToken = await createSessionToken(168);

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error('Error in /api/admin/login:', error);
    return NextResponse.json(
      { success: false, message: 'An internal authentication error occurred.' },
      { status: 500 }
    );
  }
}
