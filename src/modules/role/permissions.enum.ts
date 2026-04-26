// Granular permissions following endpoints-rbac.md
// Format: resource:action

export enum Permission {
  // Organization
  ORGANIZATION_CREATE = 'organization:create',
  ORGANIZATION_READ = 'organization:read',
  ORGANIZATION_UPDATE = 'organization:update',
  ORGANIZATION_DELETE = 'organization:delete',

  // User
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // Role
  ROLE_READ = 'role:read',

  // Department
  DEPARTMENT_CREATE = 'department:create',
  DEPARTMENT_READ = 'department:read',
  DEPARTMENT_UPDATE = 'department:update',
  DEPARTMENT_DELETE = 'department:delete',

  // Specialty
  SPECIALTY_CREATE = 'specialty:create',
  SPECIALTY_READ = 'specialty:read',
  SPECIALTY_UPDATE = 'specialty:update',
  SPECIALTY_DELETE = 'specialty:delete',

  // Course
  COURSE_CREATE = 'course:create',
  COURSE_READ = 'course:read',
  COURSE_UPDATE = 'course:update',
  COURSE_DELETE = 'course:delete',

  // Experience
  EXPERIENCE_CREATE = 'experience:create',
  EXPERIENCE_READ = 'experience:read',
  EXPERIENCE_UPDATE = 'experience:update',
  EXPERIENCE_DELETE = 'experience:delete',
  EXPERIENCE_SESSION = 'experience:session',
  EXPERIENCE_ADDRESSABLE = 'experience:addressable',

  // Group
  GROUP_CREATE = 'group:create',
  GROUP_READ = 'group:read',
  GROUP_UPDATE = 'group:update',
  GROUP_DELETE = 'group:delete',

  // User-Group
  USER_GROUP_CREATE = 'user-group:create',
  USER_GROUP_READ = 'user-group:read',
  USER_GROUP_UPDATE = 'user-group:update',
  USER_GROUP_DELETE = 'user-group:delete',

  // Group-Experience
  GROUP_EXPERIENCE_CREATE = 'group-experience:create',
  GROUP_EXPERIENCE_READ = 'group-experience:read',
  GROUP_EXPERIENCE_UPDATE = 'group-experience:update',
  GROUP_EXPERIENCE_DELETE = 'group-experience:delete',

  // Score-Event
  SCORE_EVENT_CREATE = 'score-event:create',
  SCORE_EVENT_READ = 'score-event:read',
  SCORE_EVENT_DELETE = 'score-event:delete',

  // Session
  SESSION_READ = 'session:read',
  SESSION_UPDATE = 'session:update',

  // Addressable
  ADDRESSABLE_CREATE = 'addressable:create',
  ADDRESSABLE_READ = 'addressable:read',
  ADDRESSABLE_UPDATE = 'addressable:update',
  ADDRESSABLE_DELETE = 'addressable:delete',

  // Telemetry
  TELEMETRY_CREATE = 'telemetry:create',

  // Activity-Log
  ACTIVITY_LOG_READ = 'activity-log:read',
}

// Helper to get all permissions as array
export const ALL_PERMISSIONS = Object.values(Permission);
