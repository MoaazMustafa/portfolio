import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { meetingBookingSchema } from '@/lib/validations/contact';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = meetingBookingSchema.parse(body);

    // Check slot availability (prevent double booking)
    const slot = await prisma.meetingSlot.findUnique({
      where: { id: validated.slotId },
    });

    if (!slot) {
      return NextResponse.json(
        { success: false, message: 'Time slot not found' },
        { status: 404 },
      );
    }

    if (slot.isBooked) {
      return NextResponse.json(
        { success: false, message: 'This time slot is no longer available' },
        { status: 409 },
      );
    }

    // Atomic transaction: book slot + create booking
    const booking = await prisma.$transaction(async (tx) => {
      // Double-check with row lock
      const freshSlot = await tx.meetingSlot.findUnique({
        where: { id: validated.slotId },
      });

      if (!freshSlot || freshSlot.isBooked) {
        throw new Error('SLOT_TAKEN');
      }

      await tx.meetingSlot.update({
        where: { id: validated.slotId },
        data: { isBooked: true },
      });

      return tx.meetingBooking.create({
        data: {
          slotId: validated.slotId,
          name: validated.name,
          email: validated.email,
          company: validated.company,
          message: validated.message,
          timezone: validated.timezone,
        },
        include: { slot: true },
      });
    });

    // Send emails
    const emailServiceConfigured = !!process.env.EMAIL_FROM;
    if (emailServiceConfigured) {
      await sendBookingEmails(booking);
    }

    return NextResponse.json({
      success: true,
      message: 'Meeting booked successfully!',
      booking: {
        id: booking.id,
        date: booking.slot.date,
        startTime: booking.slot.startTime,
        endTime: booking.slot.endTime,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'SLOT_TAKEN') {
      return NextResponse.json(
        { success: false, message: 'This time slot was just booked by someone else' },
        { status: 409 },
      );
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Invalid booking data' },
        { status: 400 },
      );
    }
    console.error('Meeting booking error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

// GET available slots for a date
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');

  if (!dateStr) {
    return NextResponse.json(
      { success: false, message: 'Date parameter is required' },
      { status: 400 },
    );
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return NextResponse.json(
      { success: false, message: 'Invalid date' },
      { status: 400 },
    );
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const slots = await prisma.meetingSlot.findMany({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
      isBooked: false,
    },
    orderBy: { startTime: 'asc' },
  });

  return NextResponse.json({ success: true, slots });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendBookingEmails(booking: {
  name: string;
  email: string;
  company?: string | null;
  message?: string | null;
  timezone: string;
  slot: { date: Date; startTime: string; endTime: string };
}) {
  const emailApiUrl = process.env.EMAIL_API_URL;
  const emailApiKey = process.env.EMAIL_API_KEY;
  if (!emailApiUrl || !emailApiKey) return;

  const dateStr = booking.slot.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${emailApiKey}`,
  };

  // Admin notification
  try {
    await fetch(emailApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL || 'contactwithmoaaz@gmail.com',
        subject: `New Meeting Booking: ${booking.name} - ${dateStr}`,
        html: `
          <h2>New Meeting Booked</h2>
          <p><strong>Name:</strong> ${escapeHtml(booking.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(booking.email)}</p>
          ${booking.company ? `<p><strong>Company:</strong> ${escapeHtml(booking.company)}</p>` : ''}
          <p><strong>Date:</strong> ${dateStr}</p>
          <p><strong>Time:</strong> ${booking.slot.startTime} - ${booking.slot.endTime}</p>
          <p><strong>Client Timezone:</strong> ${escapeHtml(booking.timezone)}</p>
          ${booking.message ? `<p><strong>Message:</strong> ${escapeHtml(booking.message)}</p>` : ''}
        `,
      }),
    });
  } catch (e) {
    console.error('Failed to send admin booking notification:', e);
  }

  // Client confirmation
  try {
    await fetch(emailApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: booking.email,
        subject: 'Meeting Confirmed - Moaaz Mustafa',
        html: `
          <h2>Your meeting is confirmed!</h2>
          <p>Hi ${escapeHtml(booking.name)},</p>
          <p>Your meeting has been scheduled:</p>
          <ul>
            <li><strong>Date:</strong> ${dateStr}</li>
            <li><strong>Time:</strong> ${booking.slot.startTime} - ${booking.slot.endTime}</li>
          </ul>
          <p>Looking forward to our conversation!</p>
          <br>
          <p>Best regards,</p>
          <p>Moaaz Mustafa</p>
        `,
      }),
    });
  } catch (e) {
    console.error('Failed to send client booking confirmation:', e);
  }
}
