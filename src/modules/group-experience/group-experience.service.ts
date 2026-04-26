import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GroupExperienceRepository } from './group-experience.repository';
import { CreateGroupExperienceDto, UpdateGroupExperienceDto } from './dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class GroupExperienceService {
  private readonly logger = new Logger(GroupExperienceService.name);

  constructor(private readonly groupExperienceRepository: GroupExperienceRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    groupId?: number;
    experienceId?: number;
    status?: string;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, groupId, experienceId, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.Group_ExperienceWhereInput = {};
    if (groupId !== undefined) where.groupId = groupId;
    if (experienceId !== undefined) where.experienceId = experienceId;
    if (status !== undefined) where.status = status as any;

    const { data, total } = await this.groupExperienceRepository.findMany({
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

  async findById(groupId: number, experienceId: number): Promise<any> {
    const groupExperience = await this.groupExperienceRepository.findById(groupId, experienceId);
    if (!groupExperience) {
      throw new NotFoundException(`Group_Experience not found`);
    }
    return groupExperience;
  }

  async create(dto: CreateGroupExperienceDto): Promise<any> {
    return this.groupExperienceRepository.create({
      group: { connect: { id: dto.groupId } },
      experience: { connect: { id: dto.experienceId } },
      mandatory: dto.mandatory,
    });
  }

  async update(groupId: number, experienceId: number, dto: UpdateGroupExperienceDto): Promise<any> {
    const groupExperience = await this.groupExperienceRepository.findById(groupId, experienceId);
    if (!groupExperience) {
      throw new NotFoundException(`Group_Experience not found`);
    }

    return this.groupExperienceRepository.update(groupId, experienceId, {
      ...dto,
      startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
    });
  }

  async delete(groupId: number, experienceId: number): Promise<void> {
    const groupExperience = await this.groupExperienceRepository.findById(groupId, experienceId);
    if (!groupExperience) {
      throw new NotFoundException(`Group_Experience not found`);
    }

    await this.groupExperienceRepository.delete(groupId, experienceId);
  }
}