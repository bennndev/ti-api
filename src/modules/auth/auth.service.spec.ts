import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { auth } from '@/lib/auth';

jest.mock('better-auth/node', () => ({
  fromNodeHeaders: jest.fn((h) => h),
}));

jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
      signInEmail: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const signUpDto = {
      email: 'juan@tecsup.com',
      password: 'Abc123!@',
      name: 'Juan',
      lastName: 'Pérez',
    };

    it('should call auth.api.signUpEmail with body', async () => {
      const mockResponse = { user: { id: 'user-1', email: 'juan@tecsup.com' } };
      (auth.api.signUpEmail as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.signUp(signUpDto as any);

      expect(auth.api.signUpEmail).toHaveBeenCalledWith({ body: signUpDto });
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors from signUpEmail', async () => {
      const error = new Error('Email already exists');
      (auth.api.signUpEmail as jest.Mock).mockRejectedValue(error);

      await expect(service.signUp(signUpDto as any)).rejects.toThrow('Email already exists');
    });
  });

  describe('signIn', () => {
    const signInDto = { email: 'juan@tecsup.com', password: 'Abc123!@' };

    it('should call auth.api.signInEmail with body', async () => {
      const mockResponse = { user: { id: 'user-1' }, session: { token: 'abc' } };
      (auth.api.signInEmail as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.signIn(signInDto as any);

      expect(auth.api.signInEmail).toHaveBeenCalledWith({ body: signInDto });
      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors for invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      (auth.api.signInEmail as jest.Mock).mockRejectedValue(error);

      await expect(service.signIn(signInDto as any)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should call auth.api.signOut with headers', async () => {
      const headers = { cookie: 'session=abc' } as any;
      (auth.api.signOut as jest.Mock).mockResolvedValue({ message: 'ok' });

      const result = await service.signOut(headers);

      expect(auth.api.signOut).toHaveBeenCalled();
      expect(result).toEqual({ message: 'ok' });
    });
  });

  describe('getSession', () => {
    it('should return null for no session', async () => {
      const headers = {} as any;
      (auth.api.getSession as jest.Mock).mockResolvedValue(null);

      const result = await service.getSession(headers);

      expect(result).toBeNull();
    });

    it('should return session data when valid', async () => {
      const headers = { cookie: 'session=abc' } as any;
      const mockSession = { user: { id: 'user-1' } };
      (auth.api.getSession as jest.Mock).mockResolvedValue(mockSession);

      const result = await service.getSession(headers);

      expect(result).toEqual(mockSession);
    });
  });
});
