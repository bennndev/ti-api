import 'dotenv/config';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import bcrypt from 'bcrypt';

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

  // Create system organization for superadmin
  console.log('\n🌱 Starting seed: System Organization');

  const systemOrg = await prisma.organization.upsert({
    where: { slug: 'system' },
    update: {},
    create: {
      name: 'System',
      slug: 'system',
      ruc: '00000000000',
      country: 'System',
      logo: '',
    },
  });
  console.log(`  ✓ System org created (id=${systemOrg.id})`);

  // Create superadmin
  console.log('\n🌱 Starting seed: Superadmin');

  const superAdminRole = await prisma.role.findUnique({ where: { code: 'super_admin' } });
  if (!superAdminRole) {
    throw new Error('super_admin role not found. Run roles seed first.');
  }

  // Check if superadmin already exists
  const existingSuperadmin = await prisma.user.findUnique({
    where: { email: 'superadmin@ti-platform.com' },
  });

  if (existingSuperadmin) {
    console.log(`  ✓ Superadmin already exists (id=${existingSuperadmin.id})`);
  } else {
    // Create user directly with Prisma (not via Better Auth)
    const superadmin = await prisma.user.create({
      data: {
        email: 'superadmin@ti-platform.com',
        name: 'Super',
        username: 'superadmin',
        lastName: 'Admin',
        documentType: 'SYS',
        documentNumber: '00000000',
        orgId: systemOrg.id,
        roleId: superAdminRole.id,
        emailVerified: true,
        status: true,
        loginCount: 0,
        failedLoginCount: 0,
      },
    });

    // Create account with hashed password for Better Auth
    const passwordHash = await bcrypt.hash('Superadmin123!', 10);
    await prisma.account.create({
      data: {
        userId: superadmin.id,
        providerId: 'email',
        accountId: `email:${superadmin.email}`,
        password: passwordHash,
      },
    });

    console.log(`  ✓ Superadmin created (id=${superadmin.id}, email=superadmin@ti-platform.com)`);
    console.log(`    Password: Superadmin123!`);
  }

  console.log('\n✅ Seed complete: 4 roles + system org + superadmin');
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