import { createUserSchema } from './create-user.schema';

describe('createUserSchema', () => {
  const validBody = {
    email: 'juan@tecsup.com',
    password: 'Abc123!@',
    name: 'Juan',
    orgId: 1,
    roleId: 2,
  };

  it('should accept valid create-user data', () => {
    const result = createUserSchema.safeParse(validBody);
    expect(result.success).toBe(true);
  });

  describe('password', () => {
    it('should reject weak password', () => {
      const result = createUserSchema.safeParse({ ...validBody, password: 'abc' });
      expect(result.success).toBe(false);
    });
  });

  describe('name', () => {
    it('should reject name with special characters', () => {
      const result = createUserSchema.safeParse({ ...validBody, name: 'J@uan' });
      expect(result.success).toBe(false);
    });
  });

  describe('orgId and roleId', () => {
    it('should reject negative orgId', () => {
      const result = createUserSchema.safeParse({ ...validBody, orgId: -1 });
      expect(result.success).toBe(false);
    });

    it('should reject zero roleId', () => {
      const result = createUserSchema.safeParse({ ...validBody, roleId: 0 });
      expect(result.success).toBe(false);
    });
  });

  describe('documentNumber', () => {
    it('should accept valid documentNumber', () => {
      const result = createUserSchema.safeParse({
        ...validBody,
        documentType: 'DNI',
        documentNumber: '12345678',
      });
      expect(result.success).toBe(true);
    });

    it('should accept documentNumber exceeding max length as optional', () => {
      const result = createUserSchema.safeParse({
        ...validBody,
        documentNumber: '123456789012345678901',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('email', () => {
    it('should reject invalid email', () => {
      const result = createUserSchema.safeParse({ ...validBody, email: 'not-an-email' });
      expect(result.success).toBe(false);
    });
  });
});
