import { PrismaClient } from '@prisma/client';

// Create a fresh Prisma client for seeding
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  
//   for (let i = 25; i <= 30; i++) {
//   await prisma.employee.delete({ where: { id : i} });
//   console.log(`Deleted employee with id: ${i}`);
// }
    // await prisma.employee.delete({ where: { id : 3} });
}

main()
  .catch((e) => {
    console.error('❌ Final error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });