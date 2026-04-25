import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import type { CreateOrganizationDto } from './dto/create-organization.schema';
import type { UpdateOrganizationDto } from './dto/update-organization.schema';
import type { OrganizationResponseDto } from './dto/response-organization.schema';
import { paginatedResponseSchema, PaginationMeta } from '@/modules/common/dto/pagination.schema';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(private readonly organizationRepository: OrganizationRepository) {}

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  async create(dto: CreateOrganizationDto) {
    const slug = this.slugify(dto.name);

    // Check for duplicate slug
    const existingBySlug = await this.organizationRepository.findBySlug(slug);
    if (existingBySlug) {
      throw new ConflictException(`Organization with name "${dto.name}" already exists`);
    }

    // Check for duplicate ruc
    const existingByRuc = await this.organizationRepository.findMany({
      where: { ruc: dto.ruc },
    });
    if (existingByRuc.total > 0) {
      throw new ConflictException(`Organization with RUC "${dto.ruc}" already exists`);
    }

    return this.organizationRepository.create({
      ...dto,
      slug,
    });
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    status?: boolean;
  }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const { data, total } = await this.organizationRepository.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: params.status !== undefined ? { status: params.status } : undefined,
    });

    const totalPages = Math.ceil(total / pageSize);
    const meta: PaginationMeta = { page, pageSize, total, totalPages };

    return { data, meta };
  }

  async findById(id: number) {
    const org = await this.organizationRepository.findById(id);
    if (!org) {
      throw new NotFoundException(`Organization #${id} not found`);
    }
    return org;
  }

  async update(id: number, dto: UpdateOrganizationDto) {
    await this.findById(id); // ensure exists

    if (dto.name) {
      const newSlug = this.slugify(dto.name);
      const existing = await this.organizationRepository.findBySlug(newSlug);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Organization with name "${dto.name}" already exists`);
      }
    }

    return this.organizationRepository.update(id, dto);
  }

  async softDelete(id: number) {
    await this.findById(id);
    return this.organizationRepository.softDelete(id);
  }
}
