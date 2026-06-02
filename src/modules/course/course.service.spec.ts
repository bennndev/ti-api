jest.mock('@/generated/prisma/client', () => ({
  PrismaClient: class { $connect = jest.fn() },
  Prisma: {},
}));
jest.mock('@prisma/adapter-neon', () => ({
  PrismaNeon: class {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { CourseRepository } from './course.repository';
import { NotFoundException } from '@nestjs/common';

describe('CourseService', () => {
  let service: CourseService;
  let repository: CourseRepository;

  const mockCourse = {
    id: 1,
    name: 'Introduction to VR',
    description: 'A beginner course on Virtual Reality',
    image: 'https://example.com/vr.png',
    status: true,
    specialtyId: 5,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
  };

  const mockCourse2 = {
    id: 2,
    name: 'Advanced VR',
    description: 'Advanced concepts in VR',
    image: null,
    status: false,
    specialtyId: 5,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-15'),
  };

  const mockUpdatedCourse = {
    ...mockCourse,
    name: 'Updated VR Course',
    description: 'Updated description',
    updatedAt: new Date('2025-03-01'),
  };

  const mockCreatedCourse = {
    id: 3,
    name: 'New Course',
    description: 'A newly created course',
    image: null,
    status: true,
    specialtyId: 5,
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-04-01'),
  };

  const mockRepository = {
    findById: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: CourseRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repository = module.get<CourseRepository>(CourseRepository);

    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return the course when found', async () => {
      mockRepository.findById.mockResolvedValue(mockCourse);

      const result = await service.findById(1);

      expect(result).toEqual(mockCourse);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when course is not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      await expect(service.findById(999)).rejects.toThrow(
        'Course with ID 999 not found',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated response with data and meta', async () => {
      mockRepository.findMany.mockResolvedValue({
        data: [mockCourse, mockCourse2],
        total: 2,
      });

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual(mockCourse);
      expect(result.data[1]).toEqual(mockCourse2);
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
        data: [mockCourse],
        total: 25,
      });

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result.meta.totalPages).toBe(3);
    });

    it('should pass specialtyId and status filters to repository', async () => {
      mockRepository.findMany.mockResolvedValue({
        data: [mockCourse],
        total: 1,
      });

      await service.findAll({ specialtyId: 5, status: true });

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: { specialtyId: 5, status: true },
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

    it('should not include specialtyId in where clause when undefined', async () => {
      mockRepository.findMany.mockResolvedValue({
        data: [mockCourse],
        total: 1,
      });

      await service.findAll({ page: 1 });

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 20,
        where: {},
      });
    });
  });

  describe('create', () => {
    const createDto = {
      specialtyId: 5,
      name: 'New Course',
      description: 'A newly created course',
      status: true,
    };

    it('should create a course and return it', async () => {
      mockRepository.create.mockResolvedValue(mockCreatedCourse);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCreatedCourse);
      expect(result.id).toBe(3);
      expect(result.name).toBe('New Course');
      expect(mockRepository.create).toHaveBeenCalledWith({
        specialty: { connect: { id: 5 } },
        name: 'New Course',
        description: 'A newly created course',
        image: undefined,
        status: true,
      });
    });

    it('should create a course with image when provided', async () => {
      const dtoWithImage = {
        ...createDto,
        image: 'https://example.com/img.png',
      };
      mockRepository.create.mockResolvedValue({
        ...mockCreatedCourse,
        image: 'https://example.com/img.png',
      });

      const result = await service.create(dtoWithImage);

      expect(result.image).toBe('https://example.com/img.png');
      expect(mockRepository.create).toHaveBeenCalledWith({
        specialty: { connect: { id: 5 } },
        name: 'New Course',
        description: 'A newly created course',
        image: 'https://example.com/img.png',
        status: true,
      });
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated VR Course',
      description: 'Updated description',
    };

    it('should update the course and return it', async () => {
      mockRepository.findById.mockResolvedValue(mockCourse);
      mockRepository.update.mockResolvedValue(mockUpdatedCourse);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockUpdatedCourse);
      expect(result.name).toBe('Updated VR Course');
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when course does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(999, updateDto)).rejects.toThrow(
        'Course with ID 999 not found',
      );
    });

    it('should update only partial fields', async () => {
      const partialDto = { status: false };
      mockRepository.findById.mockResolvedValue(mockCourse);
      mockRepository.update.mockResolvedValue({
        ...mockCourse,
        status: false,
      });

      const result = await service.update(1, partialDto);

      expect(result.status).toBe(false);
      expect(mockRepository.update).toHaveBeenCalledWith(1, partialDto);
    });
  });

  describe('softDelete', () => {
    it('should soft delete the course', async () => {
      mockRepository.findById.mockResolvedValue(mockCourse);
      mockRepository.softDelete.mockResolvedValue({
        ...mockCourse,
        updatedAt: new Date(),
      });

      await service.softDelete(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when course does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.softDelete(999)).rejects.toThrow(NotFoundException);
      await expect(service.softDelete(999)).rejects.toThrow(
        'Course with ID 999 not found',
      );
    });

    it('should not return a value (void return type)', async () => {
      mockRepository.findById.mockResolvedValue(mockCourse);
      mockRepository.softDelete.mockResolvedValue(undefined);

      const result = await service.softDelete(1);

      expect(result).toBeUndefined();
    });
  });
});
