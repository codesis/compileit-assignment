import { NextResponse } from 'next/server';
import { removeBooking } from '@/lib/bookings';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookingId = parseInt(id, 10);

  if (isNaN(bookingId)) {
    return NextResponse.json({ message: 'Invalid booking ID' }, { status: 400 });
  }

  try {
    const deleted = removeBooking(bookingId);

    if (!deleted) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete booking';
    return NextResponse.json({ message }, { status: 500 });
  }
}
