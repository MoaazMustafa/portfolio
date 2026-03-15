'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { postSchema, type PostFormValues } from '@/lib/validations/post';

export async function createPost(data: PostFormValues) {
  const result = postSchema.safeParse(data);

  if (!result.success) {
    return { error: 'Invalid input' };
  }

  const payload = result.data;
  const normalizedSlug = slugify(payload.slug);

  try {
    const existing = await prisma.post.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existing) {
      return { error: 'Post slug already exists' };
    }

    await prisma.post.create({
      data: {
        title: payload.title,
        slug: normalizedSlug,
        content: payload.content,
        published: payload.published ?? false,
      },
    });

    revalidatePath('/dashboard/posts');
    return { success: true };
  } catch {
    return { error: 'Failed to create post' };
  }
}

export async function updatePost(data: PostFormValues) {
  const result = postSchema.safeParse(data);

  if (!result.success) {
    return { error: 'Invalid input' };
  }

  const payload = result.data;

  if (!payload.id) {
    return { error: 'Post id is required' };
  }

  const normalizedSlug = slugify(payload.slug);

  try {
    const existing = await prisma.post.findFirst({
      where: {
        slug: normalizedSlug,
        NOT: {
          id: payload.id,
        },
      },
    });

    if (existing) {
      return { error: 'Post slug already exists' };
    }

    await prisma.post.update({
      where: { id: payload.id },
      data: {
        title: payload.title,
        slug: normalizedSlug,
        content: payload.content,
        published: payload.published ?? false,
      },
    });

    revalidatePath('/dashboard/posts');
    return { success: true };
  } catch {
    return { error: 'Failed to update post' };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath('/dashboard/posts');
    return { success: true };
  } catch {
    return { error: 'Failed to delete post' };
  }
}

export async function togglePostPublished(id: string, published: boolean) {
  try {
    await prisma.post.update({
      where: { id },
      data: { published },
    });

    revalidatePath('/dashboard/posts');
    return { success: true };
  } catch {
    return { error: 'Failed to update publish status' };
  }
}
