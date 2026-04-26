import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class DepartmentService {
  private readonly logger = new Logger(DepartmentService.name);

  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    orgId?: number;
    status?: boolean;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, orgId, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.DepartmentWhereInput = {};
    if (orgId !== undefined) where.orgId = orgId;
    if (status !== undefined) where.status = status;

    const { data, total } = await this.departmentRepository.findMany({
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
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async create(dto: CreateDepartmentDto): Promise<any> {
    return this.departmentRepository.create({
      org: { connect: { id: dto.orgId } },
      name: dto.name,
      description: dto.description,
      status: dto.status,
    });
  }

  async update(id: number, dto: UpdateDepartmentDto): Promise<any> {
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return this.departmentRepository.update(id, dto);
  }

  async softDelete(id: number): Promise<void> {
    const department = await this.departmentRepository.findById(id);
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    await this.departmentRepository.softDelete(id);
  }
}