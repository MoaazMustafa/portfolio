'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';

export async function getContactSubmissions() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUnreadCount() {
  return prisma.contactSubmission.count({ where: { isRead: false } });
}

export async function markSubmissionRead(id: string) {
  await prisma.contactSubmission.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath('/dashboard/contact');
}

export async function markAllRead() {
  await prisma.contactSubmission.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
  revalidatePath('/dashboard/contact');
}

export async function deleteSubmission(id: string) {
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath('/dashboard/contact');
}
