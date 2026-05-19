import { updateUserSchema } from './update-user.schema';

describe('updateUserSchema', () => {
  it('should accept empty body (all fields optional)', () => {
    const result = updateUserSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should accept valid partial update', () => {
    const result = updateUserSchema.safeParse({
      name: 'Juan',
      status: true,
    });
    expect(result.success).toBe(true);
  });

  it('should reject name as number', () => {
    const result = updateUserSchema.safeParse({ name: 123 });
    expect(result.success).toBe(false);
  });

  it('should reject status as string', () => {
    const result = updateUserSchema.safeParse({ status: 'activo' });
    expect(result.success).toBe(false);
  });

  it('should accept all fields valid', () => {
    const result = updateUserSchema.safeParse({
      name: 'Juan',
      lastName: 'Pérez',
      username: 'jperez',
      documentType: 'DNI',
      documentNumber: '12345678',
      preferredLanguage: 'es',
      status: false,
    });
    expect(result.success).toBe(true);
  });
});
