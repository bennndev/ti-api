import { signInSchema } from './sign-in.schema';

describe('signInSchema', () => {
  const validBody = {
    email: 'juan@tecsup.com',
    password: 'anything',
  };

  it('should accept valid sign-in data', () => {
    const result = signInSchema.safeParse(validBody);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const result = signInSchema.safeParse({ ...validBody, email: 'no-es-email' });
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const result = signInSchema.safeParse({ ...validBody, password: '' });
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const result = signInSchema.safeParse({ password: 'anything' });
    expect(result.success).toBe(false);
  });
});
