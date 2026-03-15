'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
});

export async function createCategory(data: z.infer<typeof categorySchema>) {
  const result = categorySchema.safeParse(data);

  if (!result.success) {
    return { error: 'Invalid input' };
  }

  const { name } = result.data;
  const slug = slugify(name);

  try {
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return { error: 'Category already exists' };
    }

    await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    revalidatePath('/dashboard/categories');
    return { success: true };
  } catch {
    // console.error('Failed to create category:', error);
    return { error: 'Failed to create category' };
  }
}

export async function updateCategory(data: z.infer<typeof categorySchema>) {
  const result = categorySchema.safeParse(data);

  if (!result.success) {
    return { error: 'Invalid input' };
  }

  const { id, name } = result.data;

  if (!id) {
    return { error: 'ID is required' };
  }

  const slug = slugify(name);

  try {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });

    if (existing) {
      return { error: 'Category with this name already exists' };
    }

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    revalidatePath('/dashboard/categories');
    return { success: true };
  } catch {
    // console.error('Failed to update category:', error);
    return { error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category is used
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!category) {
      return { error: 'Category not found' };
    }

    if (category._count.projects > 0) {
      return {
        error: `Cannot delete category used by ${category._count.projects} projects`,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/dashboard/categories');
    return { success: true };
  } catch {
    // console.error('Failed to delete category:', error);
    return { error: 'Failed to delete category' };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });
    return { categories };
  } catch {
    // console.error('Failed to fetch categories:', error);
    return { error: 'Failed to fetch categories' };
  }
}
