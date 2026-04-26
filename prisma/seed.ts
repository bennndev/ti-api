import 'dotenv/config';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DIRECT_URL! }),
});

const roles = [
  {
    code: 'super_admin',
    name: 'Super Admin',
    description: 'Plenos poderes sobre todas las organizaciones. Solo para desarrollo.',
  },
  {
    code: 'org_admin',
    name: 'Org Admin',
    description: 'Administrador de organización. Gestiona usuarios y contenidos de su org.',
  },
  {
    code: 'instructor',
    name: 'Instructor',
    description: 'Crea y gestiona experiencias educativas. No administra usuarios.',
  },
  {
    code: 'student',
    name: 'Student',
    description: 'Usuario final. Consume experiencias y ve su progreso.',
  },
];

async function main(): Promise<void> {
  console.log('🌱 Starting seed: Roles');

  for (const role of roles) {
    const created = await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    });
    console.log(`  ✓ Role "${created.code}" (id=${created.id})`);
  }
  console.log('\n✅ Seed complete:');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });