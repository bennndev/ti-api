import { Test, TestingModule } from '@nestjs/testing';
import { XrAuthService } from './xr-auth.service';
import { XrAuthRepository } from './xr-auth.repository';
import { PrismaService } from '@/lib/prisma';
import { UnauthorizedException } from '@nestjs/common';

describe('XrAuthService', () => {
  let service: XrAuthService;
  let repository: XrAuthRepository;
  let prisma: PrismaService;

  const mockRepository = {
    createUnchecked: jest.fn(),
    findValidPin: jest.fn(),
    markAsUsed: jest.fn(),
    deleteExpiredPins: jest.fn(),
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XrAuthService,
        { provide: XrAuthRepository, useValue: mockRepository },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<XrAuthService>(XrAuthService);
    repository = module.get<XrAuthRepository>(XrAuthRepository);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('generatePin', () => {
    it('should generate a 6-digit PIN', async () => {
      mockRepository.createUnchecked.mockResolvedValue({ id: 1 });

      const pin = await service.generatePin('user-123');

      expect(pin).toMatch(/^\d{6}$/);
      expect(mockRepository.createUnchecked).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-123',
          pin: expect.stringMatching(/^\d{6}$/),
          expiresAt: expect.any(Date),
        }),
      );
    });

    it('should store PIN with 5 minute expiry', async () => {
      mockRepository.createUnchecked.mockResolvedValue({ id: 1 });

      const before = new Date();
      await service.generatePin('user-123');
      const after = new Date();

      const call = mockRepository.createUnchecked.mock.calls[0][0];
      const expectedMin = new Date(before.getTime() + 5 * 60 * 1000);
      const expectedMax = new Date(after.getTime() + 5 * 60 * 1000);

      expect(call.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin.getTime());
      expect(call.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax.getTime());
    });
  });

  describe('validatePinAndGetToken', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      orgId: 1,
      roleId: 2,
    };

    it('should return token for valid PIN', async () => {
      mockRepository.findValidPin.mockResolvedValue({
        id: 1,
        userId: 'user-123',
        pin: '123456',
        expiresAt: new Date(Date.now() + 60000),
      });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockRepository.markAsUsed.mockResolvedValue({ id: 1, usedAt: new Date() });

      const result = await service.validatePinAndGetToken({
        pin: '123456',
        deviceId: 'xr-device-1',
      });

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresAt');
      expect(result.user.id).toBe('user-123');
      expect(mockRepository.markAsUsed).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException for invalid PIN', async () => {
      mockRepository.findValidPin.mockResolvedValue(null);

      await expect(
        service.validatePinAndGetToken({ pin: '000000' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockRepository.findValidPin.mockResolvedValue({
        id: 1,
        userId: 'user-123',
        pin: '123456',
        expiresAt: new Date(Date.now() + 60000),
      });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.validatePinAndGetToken({ pin: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});