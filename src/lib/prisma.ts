import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

console.log('Initializing Prisma Client...');

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Debug: Check if models are loaded
if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    const modelCount = Object.keys(prisma).length;
    console.log(`Prisma Client initialized with keys: ${Object.keys(prisma).join(', ')}`);
}
