import { validatePinSchema } from './validate-pin.schema';

describe('validatePinSchema', () => {
  it('should accept valid 6-digit PIN', () => {
    const result = validatePinSchema.safeParse({ pin: '123456' });
    expect(result.success).toBe(true);
  });

  it('should accept PIN with deviceId', () => {
    const result = validatePinSchema.safeParse({ pin: '482931', deviceId: 'xr-device-1' });
    expect(result.success).toBe(true);
  });

  it('should reject PIN with letters', () => {
    const result = validatePinSchema.safeParse({ pin: 'abc123' });
    expect(result.success).toBe(false);
  });

  it('should reject PIN shorter than 6 digits', () => {
    const result = validatePinSchema.safeParse({ pin: '12345' });
    expect(result.success).toBe(false);
  });
});
