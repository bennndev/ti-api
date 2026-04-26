import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ExperienceRepository } from './experience.repository';
import { CreateExperienceDto, UpdateExperienceDto } from './dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    courseId?: number;
    status?: string;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, courseId, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ExperienceWhereInput = {};
    if (courseId !== undefined) where.courseId = courseId;
    if (status !== undefined) where.status = status as any;

    const { data, total } = await this.experienceRepository.findMany({
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
    const experience = await this.experienceRepository.findById(id);
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return experience;
  }

  async create(dto: CreateExperienceDto): Promise<any> {
    return this.experienceRepository.create({
      course: { connect: { id: dto.courseId } },
      name: dto.name,
      description: dto.description,
      type: dto.type,
      image: dto.image,
      duration: dto.duration,
      score: dto.score,
      attempts: dto.attempts,
      order: dto.order,
      status: dto.status,
    });
  }

  async update(id: number, dto: UpdateExperienceDto): Promise<any> {
    const experience = await this.experienceRepository.findById(id);
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return this.experienceRepository.update(id, dto);
  }

  async softDelete(id: number): Promise<void> {
    const experience = await this.experienceRepository.findById(id);
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    await this.experienceRepository.softDelete(id);
  }
}