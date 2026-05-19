import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationRepository } from './organization.repository';

describe('OrganizationService', () => {
  let service: OrganizationService;

  const mockRepository = {
    findBySlug: jest.fn(),
    findByRuc: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        { provide: OrganizationRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = { name: 'TECSUP', ruc: '20123456789', country: 'Perú' };

    it('should create organization with generated slug', async () => {
      mockRepository.findBySlug.mockResolvedValue(null);
      mockRepository.findByRuc.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({ id: 1, ...createDto, slug: 'tecsup' });

      const result = await service.create(createDto as any);

      expect(result.id).toBe(1);
      expect(result.slug).toBe('tecsup');
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException for duplicate slug', async () => {
      mockRepository.findBySlug.mockResolvedValue({ id: 1, slug: 'tecsup' });

      await expect(service.create(createDto as any)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException for duplicate RUC', async () => {
      mockRepository.findBySlug.mockResolvedValue(null);
      mockRepository.findByRuc.mockResolvedValue({ id: 1, ruc: '20123456789' });

      await expect(service.create(createDto as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findById', () => {
    it('should return organization when found', async () => {
      const mockOrg = { id: 1, name: 'TECSUP' };
      mockRepository.findById.mockResolvedValue(mockOrg);

      const result = await service.findById(1);
      expect(result).toEqual(mockOrg);
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should soft delete existing organization', async () => {
      mockRepository.findById.mockResolvedValue({ id: 1 });
      mockRepository.softDelete.mockResolvedValue({ id: 1, deletedAt: new Date() });

      const result = await service.softDelete(1);
      expect(result.deletedAt).toBeDefined();
    });
  });
});
