'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';

export async function getAvailableSlots(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.meetingSlot.findMany({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
      isBooked: false,
    },
    orderBy: { startTime: 'asc' },
  });
}

export async function getAllSlots() {
  return prisma.meetingSlot.findMany({
    include: { booking: true },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
}

export async function getUpcomingBookings() {
  return prisma.meetingBooking.findMany({
    where: { slot: { date: { gte: new Date() } } },
    include: { slot: true },
    orderBy: { slot: { date: 'asc' } },
  });
}

export async function getAllBookings() {
  return prisma.meetingBooking.findMany({
    include: { slot: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createMeetingSlots(
  slots: { date: Date; startTime: string; endTime: string; timezone?: string }[],
) {
  const created = await prisma.meetingSlot.createMany({
    data: slots.map((s) => ({
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      timezone: s.timezone || 'Asia/Karachi',
    })),
    skipDuplicates: true,
  });
  revalidatePath('/contact');
  revalidatePath('/dashboard/meetings');
  return created;
}

export async function deleteMeetingSlot(id: string) {
  await prisma.meetingSlot.delete({ where: { id } });
  revalidatePath('/contact');
  revalidatePath('/dashboard/meetings');
}

export async function deleteBooking(id: string) {
  const booking = await prisma.meetingBooking.findUnique({
    where: { id },
    select: { slotId: true },
  });
  if (booking) {
    await prisma.$transaction([
      prisma.meetingBooking.delete({ where: { id } }),
      prisma.meetingSlot.update({
        where: { id: booking.slotId },
        data: { isBooked: false },
      }),
    ]);
  }
  revalidatePath('/contact');
  revalidatePath('/dashboard/meetings');
}
