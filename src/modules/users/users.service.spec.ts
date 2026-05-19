import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

jest.mock('better-auth/node', () => ({
  fromNodeHeaders: jest.fn((h) => h),
}));

jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
    },
  },
}));

import { auth } from '@/lib/auth';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return mapped user when found', async () => {
      mockRepository.findById.mockResolvedValue({
        id: 'user-1',
        email: 'juan@tecsup.com',
        username: 'jperez',
        name: 'Juan',
        orgId: 1,
        roleId: 2,
        emailVerified: false,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.findById('user-1');

      expect(result.id).toBe('user-1');
      expect(result.email).toBe('juan@tecsup.com');
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('user-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    const mockUser = {
      id: 'user-2',
      email: 'test@tecsup.com',
      orgId: 1,
      roleId: 2,
    };

    it('should prevent self-deletion', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      await expect(
        service.softDelete('user-2', { id: 'user-2', orgId: 1, roleId: 2 }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should prevent deleting users from other organizations', async () => {
      mockRepository.findById.mockResolvedValue({ ...mockUser, orgId: 2 });

      await expect(
        service.softDelete('user-2', { id: 'admin-1', orgId: 1, roleId: 2 }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow superadmin to delete any user', async () => {
      const mockDeletedUser = {
        ...mockUser,
        orgId: 2,
        deletedAt: new Date(),
        emailVerified: false,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.findById.mockResolvedValue(mockDeletedUser);
      mockRepository.softDelete.mockResolvedValue(mockDeletedUser);

      const result = await service.softDelete('user-2', { id: 'admin-1', orgId: 1, roleId: 1 });

      expect(result.id).toBe('user-2');
    });
  });

  describe('update', () => {
    it('should throw ForbiddenException for cross-org update', async () => {
      mockRepository.findById.mockResolvedValue({
        id: 'user-2',
        email: 'test@tecsup.com',
        orgId: 2,
        roleId: 2,
      });

      await expect(
        service.update('user-2', { name: 'Test' }, { id: 'admin-1', orgId: 1, roleId: 2 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
