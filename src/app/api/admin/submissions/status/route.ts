import { NextResponse } from 'next/server';
import { updateContactStatusInSheet } from '@/lib/googleSheets';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { rowIndex, status } = body;

    if (!rowIndex || typeof rowIndex !== 'number' || !status) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: rowIndex and status are required' },
        { status: 400 }
      );
    }

    const result = await updateContactStatusInSheet(rowIndex, status);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/admin/submissions/status:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update status',
      },
      { status: 500 }
    );
  }
}
