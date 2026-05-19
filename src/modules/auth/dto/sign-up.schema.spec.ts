import { signUpSchema } from './sign-up.schema';

describe('signUpSchema', () => {
  const validBody = {
    email: 'juan@tecsup.com',
    password: 'Abc123!@',
    name: 'Juan',
    lastName: 'Pérez',
  };

  it('should accept valid sign-up data', () => {
    const result = signUpSchema.safeParse(validBody);
    expect(result.success).toBe(true);
  });

  describe('password', () => {
    it('should reject password shorter than 8 chars', () => {
      const result = signUpSchema.safeParse({ ...validBody, password: 'Ab1!' });
      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const result = signUpSchema.safeParse({ ...validBody, password: 'abcdef1!' });
      expect(result.success).toBe(false);
    });

    it('should reject password without lowercase', () => {
      const result = signUpSchema.safeParse({ ...validBody, password: 'ABCDEF1!' });
      expect(result.success).toBe(false);
    });

    it('should reject password without number', () => {
      const result = signUpSchema.safeParse({ ...validBody, password: 'Abcdefg!' });
      expect(result.success).toBe(false);
    });

    it('should reject password without special character', () => {
      const result = signUpSchema.safeParse({ ...validBody, password: 'Abcdefg1' });
      expect(result.success).toBe(false);
    });
  });

  describe('name and lastName', () => {
    it('should reject name with special characters', () => {
      const result = signUpSchema.safeParse({ ...validBody, name: 'J@uan' });
      expect(result.success).toBe(false);
    });

    it('should reject name with numbers', () => {
      const result = signUpSchema.safeParse({ ...validBody, name: 'Juan123' });
      expect(result.success).toBe(false);
    });

    it('should reject lastName with symbols', () => {
      const result = signUpSchema.safeParse({ ...validBody, lastName: 'Pérez#' });
      expect(result.success).toBe(false);
    });
  });

  describe('email', () => {
    it('should reject invalid email format', () => {
      const result = signUpSchema.safeParse({ ...validBody, email: 'no-es-email' });
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const result = signUpSchema.safeParse({ ...validBody, email: '' });
      expect(result.success).toBe(false);
    });
  });
});
