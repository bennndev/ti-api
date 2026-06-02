jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
    },
  },
}));
jest.mock('@/generated/prisma/client', () => ({
  PrismaClient: class { $connect = jest.fn() },
  Prisma: {},
}));
jest.mock('@prisma/adapter-neon', () => ({
  PrismaNeon: class {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    roleId: 2,
    orgId: 1,
    emailVerified: true,
    status: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
  };

  const mockUser2 = {
    id: 'user-456',
    email: 'other@example.com',
    username: 'otheruser',
    name: 'Other User',
    firstName: 'Other',
    lastName: 'User',
    roleId: 2,
    orgId: 2,
    emailVerified: false,
    status: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-15'),
  };

  const mockUpdatedUser = {
    ...mockUser,
    name: 'Updated Name',
    updatedAt: new Date('2025-03-01'),
  };

  const mockDeletedUser = {
    ...mockUser,
    deletedAt: new Date('2025-03-01'),
  };

  const mockRepository = {
    findById: jest.fn(),
    findMany: jest.fn(),
    findByEmail: jest.fn(),
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
    repository = module.get<UsersRepository>(UsersRepository);

    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return the mapped user when found', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById('user-123');

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        roleId: 2,
        orgId: 1,
        emailVerified: true,
        status: true,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString(),
      });
      expect(mockRepository.findById).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('nonexistent')).rejects.toThrow(
        'User #nonexistent not found',
      );
    });

    it('should handle null optional fields in the response mapping', async () => {
      const userWithNulls = {
        id: 'user-min',
        email: 'min@example.com',
        username: null,
        name: null,
        firstName: null,
        lastName: null,
        roleId: null,
        orgId: null,
        emailVerified: false,
        status: true,
        createdAt: null,
        updatedAt: null,
      };
      mockRepository.findById.mockResolvedValue(userWithNulls);

      const result = await service.findById('user-min');

      expect(result.username).toBeNull();
      expect(result.name).toBeNull();
      expect(result.roleId).toBeNull();
      expect(result.orgId).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated response with data and meta', async () => {
      mockRepository.findMany.mockResolvedValue({
        data: [mockUser, mockUser2],
        total: 2,
      });

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({
        page: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1,
      });
      expect(mockRepository.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
      });
    });

    it('should use default page=1 and pageSize=20 when not provided', async () => {
      mockRepository.findMany.mockResolvedValue({
        data: [],
        total: 0,
      });

      const result = await service.findAll({});

      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(20);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(0);
      expect(mockRepository.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: {},
      });
    });

    it('should calculate correct totalPages', async () => {
      mockRepository.findMany.mockResolvedValue({
        data: [mockUser],
        total: 25,
      });

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result.meta.totalPages).toBe(3);
    });

    it('should pass orgId and status filters to repository', async () => {
      mockRepository.findMany.mockResolvedValue({
        data: [mockUser],
        total: 1,
      });

      await service.findAll({ orgId: 1, status: true });

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: { orgId: 1, status: true },
      });
    });

    it('should calculate correct skip for page > 1', async () => {
      mockRepository.findMany.mockResolvedValue({
        data: [],
        total: 0,
      });

      await service.findAll({ page: 3, pageSize: 10 });

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        skip: 20,
        take: 10,
        where: {},
      });
    });
  });

  describe('update', () => {
    const currentUser = { id: 'admin-1', orgId: 1, roleId: 2 };
    const updateDto = { name: 'Updated Name' };

    it('should update the user and return mapped response', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.update('user-123', updateDto, currentUser);

      expect(result.name).toBe('Updated Name');
      expect(mockRepository.findById).toHaveBeenCalledWith('user-123');
      expect(mockRepository.update).toHaveBeenCalledWith('user-123', updateDto);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('nonexistent', updateDto, currentUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for cross-org access by non-superadmin', async () => {
      mockRepository.findById.mockResolvedValue(mockUser2); // orgId=2

      await expect(
        service.update('user-456', updateDto, currentUser),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.update('user-456', updateDto, currentUser),
      ).rejects.toThrow('Cannot update users from other organizations');
    });

    it('should allow cross-org access for superadmin (roleId=1)', async () => {
      const superadmin = { id: 'admin-1', orgId: 1, roleId: 1 };
      mockRepository.findById.mockResolvedValue(mockUser2); // orgId=2
      mockRepository.update.mockResolvedValue({
        ...mockUser2,
        name: 'Updated',
      });

      const result = await service.update(
        'user-456',
        updateDto,
        superadmin,
      );

      expect(result.name).toBe('Updated');
      expect(mockRepository.update).toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    const currentUser = { id: 'admin-1', orgId: 1, roleId: 2 };

    it('should soft delete the user and return mapped response', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.softDelete.mockResolvedValue(mockDeletedUser);

      const result = await service.softDelete('user-123', currentUser);

      expect(result.id).toBe('user-123');
      expect(mockRepository.findById).toHaveBeenCalledWith('user-123');
      expect(mockRepository.softDelete).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.softDelete('nonexistent', currentUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when deleting own account', async () => {
      const selfDeleteUser = { ...mockUser, id: 'admin-1' };
      mockRepository.findById.mockResolvedValue(selfDeleteUser);

      await expect(
        service.softDelete('admin-1', currentUser),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.softDelete('admin-1', currentUser),
      ).rejects.toThrow('Cannot delete your own account');
    });

    it('should throw ForbiddenException for cross-org deletion by non-superadmin', async () => {
      mockRepository.findById.mockResolvedValue(mockUser2); // orgId=2

      await expect(
        service.softDelete('user-456', currentUser),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.softDelete('user-456', currentUser),
      ).rejects.toThrow('Cannot delete users from other organizations');
    });

    it('should allow cross-org deletion for superadmin (roleId=1)', async () => {
      const superadmin = { id: 'admin-1', orgId: 1, roleId: 1 };
      mockRepository.findById.mockResolvedValue(mockUser2);
      mockRepository.softDelete.mockResolvedValue({
        ...mockUser2,
        deletedAt: new Date(),
      });

      const result = await service.softDelete('user-456', superadmin);

      expect(result.id).toBe('user-456');
      expect(mockRepository.softDelete).toHaveBeenCalledWith('user-456');
    });
  });
});
