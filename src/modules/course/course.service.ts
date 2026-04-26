import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(private readonly courseRepository: CourseRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    specialtyId?: number;
    status?: boolean;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, specialtyId, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.CourseWhereInput = {};
    if (specialtyId !== undefined) where.specialtyId = specialtyId;
    if (status !== undefined) where.status = status;

    const { data, total } = await this.courseRepository.findMany({
      skip,
      take: pageSize,
      where,
    });

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findById(id: number): Promise<any> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async create(dto: CreateCourseDto): Promise<any> {
    return this.courseRepository.create({
      specialty: { connect: { id: dto.specialtyId } },
      name: dto.name,
      description: dto.description,
      image: dto.image,
      status: dto.status,
    });
  }

  async update(id: number, dto: UpdateCourseDto): Promise<any> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return this.courseRepository.update(id, dto);
  }

  async softDelete(id: number): Promise<void> {
    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    await this.courseRepository.softDelete(id);
  }
}