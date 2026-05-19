import { createOrganizationSchema } from './create-organization.schema';

describe('createOrganizationSchema', () => {
  const validBody = {
    name: 'TECSUP',
    ruc: '20123456789',
    country: 'Perú',
  };

  it('should accept valid organization data', () => {
    const result = createOrganizationSchema.safeParse(validBody);
    expect(result.success).toBe(true);
  });

  describe('ruc', () => {
    it('should reject RUC with letters', () => {
      const result = createOrganizationSchema.safeParse({ ...validBody, ruc: 'abc20123456' });
      expect(result.success).toBe(false);
    });

    it('should reject RUC shorter than 11 digits', () => {
      const result = createOrganizationSchema.safeParse({ ...validBody, ruc: '12345678' });
      expect(result.success).toBe(false);
    });

    it('should reject RUC longer than 11 digits', () => {
      const result = createOrganizationSchema.safeParse({ ...validBody, ruc: '123456789012' });
      expect(result.success).toBe(false);
    });
  });

  describe('name', () => {
    it('should reject name with symbols', () => {
      const result = createOrganizationSchema.safeParse({ ...validBody, name: '@@@' });
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const result = createOrganizationSchema.safeParse({ ...validBody, name: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('country', () => {
    it('should reject empty country', () => {
      const result = createOrganizationSchema.safeParse({ ...validBody, country: '' });
      expect(result.success).toBe(false);
    });
  });
});
