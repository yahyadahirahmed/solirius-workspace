import 'dotenv/config';
import app from './app';
import prisma from './lib/prisma';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
