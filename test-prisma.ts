import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Prisma Client initialized');
  // Check if project property exists on the instance
  console.log('Is project model available?', 'project' in prisma);
  
  if (prisma.project) {
     const count = await prisma.project.count();
     console.log('Project count:', count);
  } else {
     console.log('prisma.project is UNDEFINED');
     // console.log('Available keys:', Object.keys(prisma)); // Often empty for PrismaClient
  }
}

main()
  .catch(e => {
    console.error('Error in main:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
