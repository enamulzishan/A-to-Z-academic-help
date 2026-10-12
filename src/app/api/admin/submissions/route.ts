import { NextResponse } from 'next/server';
import { fetchAllSubmissions } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchAllSubmissions();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/admin/submissions:', error);
    return NextResponse.json(
      {
        configured: false,
        error: error instanceof Error ? error.message : 'Failed to fetch submissions',
        contacts: [],
        checklists: [],
      },
      { status: 500 }
    );
  }
}
