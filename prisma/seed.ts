import 'dotenv/config';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DIRECT_URL! }),
});

// Granular permissions following endpoints-rbac.md
const permissions = [
  // Organization
  { code: 'organization:create', name: 'Create Organization', module: 'organization', action: 'create' },
  { code: 'organization:read', name: 'Read Organization', module: 'organization', action: 'read' },
  { code: 'organization:update', name: 'Update Organization', module: 'organization', action: 'update' },
  { code: 'organization:delete', name: 'Delete Organization', module: 'organization', action: 'delete' },

  // User
  { code: 'user:create', name: 'Create User', module: 'user', action: 'create' },
  { code: 'user:read', name: 'Read User', module: 'user', action: 'read' },
  { code: 'user:update', name: 'Update User', module: 'user', action: 'update' },
  { code: 'user:delete', name: 'Delete User', module: 'user', action: 'delete' },

  // Role
  { code: 'role:read', name: 'Read Role', module: 'role', action: 'read' },

  // Department
  { code: 'department:create', name: 'Create Department', module: 'department', action: 'create' },
  { code: 'department:read', name: 'Read Department', module: 'department', action: 'read' },
  { code: 'department:update', name: 'Update Department', module: 'department', action: 'update' },
  { code: 'department:delete', name: 'Delete Department', module: 'department', action: 'delete' },

  // Specialty
  { code: 'specialty:create', name: 'Create Specialty', module: 'specialty', action: 'create' },
  { code: 'specialty:read', name: 'Read Specialty', module: 'specialty', action: 'read' },
  { code: 'specialty:update', name: 'Update Specialty', module: 'specialty', action: 'update' },
  { code: 'specialty:delete', name: 'Delete Specialty', module: 'specialty', action: 'delete' },

  // Course
  { code: 'course:create', name: 'Create Course', module: 'course', action: 'create' },
  { code: 'course:read', name: 'Read Course', module: 'course', action: 'read' },
  { code: 'course:update', name: 'Update Course', module: 'course', action: 'update' },
  { code: 'course:delete', name: 'Delete Course', module: 'course', action: 'delete' },

  // Experience
  { code: 'experience:create', name: 'Create Experience', module: 'experience', action: 'create' },
  { code: 'experience:read', name: 'Read Experience', module: 'experience', action: 'read' },
  { code: 'experience:update', name: 'Update Experience', module: 'experience', action: 'update' },
  { code: 'experience:delete', name: 'Delete Experience', module: 'experience', action: 'delete' },
  { code: 'experience:session', name: 'Manage Experience Session', module: 'experience', action: 'session' },
  { code: 'experience:addressable', name: 'Access Experience Addressable', module: 'experience', action: 'addressable' },

  // Group
  { code: 'group:create', name: 'Create Group', module: 'group', action: 'create' },
  { code: 'group:read', name: 'Read Group', module: 'group', action: 'read' },
  { code: 'group:update', name: 'Update Group', module: 'group', action: 'update' },
  { code: 'group:delete', name: 'Delete Group', module: 'group', action: 'delete' },

  // User-Group
  { code: 'user-group:create', name: 'Create User-Group', module: 'user-group', action: 'create' },
  { code: 'user-group:read', name: 'Read User-Group', module: 'user-group', action: 'read' },
  { code: 'user-group:update', name: 'Update User-Group', module: 'user-group', action: 'update' },
  { code: 'user-group:delete', name: 'Delete User-Group', module: 'user-group', action: 'delete' },

  // Group-Experience
  { code: 'group-experience:create', name: 'Create Group-Experience', module: 'group-experience', action: 'create' },
  { code: 'group-experience:read', name: 'Read Group-Experience', module: 'group-experience', action: 'read' },
  { code: 'group-experience:update', name: 'Update Group-Experience', module: 'group-experience', action: 'update' },
  { code: 'group-experience:delete', name: 'Delete Group-Experience', module: 'group-experience', action: 'delete' },

  // Score-Event
  { code: 'score-event:create', name: 'Create Score Event', module: 'score-event', action: 'create' },
  { code: 'score-event:read', name: 'Read Score Event', module: 'score-event', action: 'read' },
  { code: 'score-event:delete', name: 'Delete Score Event', module: 'score-event', action: 'delete' },

  // Session
  { code: 'session:read', name: 'Read Session', module: 'session', action: 'read' },
  { code: 'session:update', name: 'Update Session', module: 'session', action: 'update' },

  // Addressable
  { code: 'addressable:create', name: 'Create Addressable', module: 'addressable', action: 'create' },
  { code: 'addressable:read', name: 'Read Addressable', module: 'addressable', action: 'read' },
  { code: 'addressable:update', name: 'Update Addressable', module: 'addressable', action: 'update' },
  { code: 'addressable:delete', name: 'Delete Addressable', module: 'addressable', action: 'delete' },

  // Telemetry
  { code: 'telemetry:create', name: 'Create Telemetry', module: 'telemetry', action: 'create' },

  // Activity-Log
  { code: 'activity-log:read', name: 'Read Activity Log', module: 'activity-log', action: 'read' },
];

// Role definitions with their permissions
const roles = [
  {
    code: 'super_admin',
    name: 'Super Admin',
    description: 'Plenos poderes sobre todas las organizaciones. Solo para desarrollo.',
    permissions: permissions.map((p) => p.code), // ALL permissions
  },
  {
    code: 'org_admin',
    name: 'Org Admin',
    description: 'Administrador de organización. Gestiona usuarios y contenidos de su org.',
    permissions: [
      // Users
      'user:create', 'user:read', 'user:update', 'user:delete',
      // Roles
      'role:read',
      // Department
      'department:create', 'department:read', 'department:update', 'department:delete',
      // Specialty
      'specialty:create', 'specialty:read', 'specialty:update', 'specialty:delete',
      // Course
      'course:create', 'course:read', 'course:update', 'course:delete',
      // Experience
      'experience:create', 'experience:read', 'experience:update', 'experience:delete',
      'experience:session', 'experience:addressable',
      // Group
      'group:create', 'group:read', 'group:update', 'group:delete',
      // User-Group
      'user-group:create', 'user-group:read', 'user-group:update', 'user-group:delete',
      // Group-Experience
      'group-experience:create', 'group-experience:read', 'group-experience:update', 'group-experience:delete',
      // Score-Event
      'score-event:read', 'score-event:delete',
      // Session
      'session:read',
      // Addressable
      'addressable:create', 'addressable:read', 'addressable:update', 'addressable:delete',
      // Activity-Log
      'activity-log:read',
    ],
  },
  {
    code: 'instructor',
    name: 'Instructor',
    description: 'Crea y gestiona experiencias educativas. No administra usuarios.',
    permissions: [
      // Experience (no create/delete, but update and session)
      'experience:read', 'experience:update', 'experience:session',
      // Group
      'group:create', 'group:read', 'group:update', 'group:delete',
      // User-Group
      'user-group:create', 'user-group:read', 'user-group:update', 'user-group:delete',
      // Group-Experience
      'group-experience:create', 'group-experience:read', 'group-experience:update', 'group-experience:delete',
      // Score-Event
      'score-event:read',
      // Session
      'session:read', 'session:update',
      // Addressable
      'addressable:read', 'addressable:update',
      // Role (read only)
      'role:read',
    ],
  },
  {
    code: 'student',
    name: 'Student',
    description: 'Usuario final. Consume experiencias y ve su progreso.',
    permissions: [
      // User (read only - self)
      'user:read',
      // Role (read only)
      'role:read',
      // Experience
      'experience:session',
      // Group (read only - own groups)
      'group:read',
      // User-Group (read only - own memberships)
      'user-group:read',
      // Group-Experience (read only - own groups)
      'group-experience:read',
      // Score-Event (create for VR, read for self)
      'score-event:create', 'score-event:read',
      // Session
      'session:read', 'session:update',
      // Addressable (read only)
      'addressable:read',
      // Telemetry
      'telemetry:create',
    ],
  },
];

async function main(): Promise<void> {
  console.log('🌱 Starting seed: Permissions & Roles\n');

  // Seed Permissions
  console.log('📋 Creating permissions...');
  const permissionIds: Record<string, number> = {};

  for (const perm of permissions) {
    const created = await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
    permissionIds[perm.code] = created.id;
  }
  console.log(`  ✓ ${permissions.length} permissions created`);

  // Seed Roles with Permissions
  console.log('\n👥 Creating roles with permissions...');

  for (const role of roles) {
    const created = await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
      },
    });

    // Clear existing permissions and assign new ones
    await prisma.role_Permission.deleteMany({
      where: { roleId: created.id },
    });

    const permissionLinks = role.permissions.map((permCode) => ({
      roleId: created.id,
      permissionId: permissionIds[permCode],
    }));

    if (permissionLinks.length > 0) {
      await prisma.role_Permission.createMany({
        data: permissionLinks,
      });
    }

    console.log(`  ✓ Role "${created.code}" (id=${created.id}) - ${role.permissions.length} permissions`);
  }

  console.log('\n✅ Seed complete!');
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
