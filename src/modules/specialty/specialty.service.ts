import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SpecialtyRepository } from './specialty.repository';
import { CreateSpecialtyDto, UpdateSpecialtyDto } from './dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class SpecialtyService {
  private readonly logger = new Logger(SpecialtyService.name);

  constructor(private readonly specialtyRepository: SpecialtyRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    departmentId?: number;
    status?: boolean;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, departmentId, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.SpecialtyWhereInput = {};
    if (departmentId !== undefined) where.departmentId = departmentId;
    if (status !== undefined) where.status = status;

    const { data, total } = await this.specialtyRepository.findMany({
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
    const specialty = await this.specialtyRepository.findById(id);
    if (!specialty) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }
    return specialty;
  }

  async create(dto: CreateSpecialtyDto): Promise<any> {
    return this.specialtyRepository.create({
      department: { connect: { id: dto.departmentId } },
      name: dto.name,
      code: dto.code,
      description: dto.description,
      image: dto.image,
      status: dto.status,
    });
  }

  async update(id: number, dto: UpdateSpecialtyDto): Promise<any> {
    const specialty = await this.specialtyRepository.findById(id);
    if (!specialty) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }

    return this.specialtyRepository.update(id, dto);
  }

  async softDelete(id: number): Promise<void> {
    const specialty = await this.specialtyRepository.findById(id);
    if (!specialty) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }

    await this.specialtyRepository.softDelete(id);
  }
}