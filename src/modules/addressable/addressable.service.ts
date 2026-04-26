import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AddressableRepository } from './addressable.repository';
import { CreateAddressableDto, UpdateAddressableDto } from './dto';

@Injectable()
export class AddressableService {
  private readonly logger = new Logger(AddressableService.name);

  constructor(private readonly addressableRepository: AddressableRepository) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    experienceId?: number;
    isActive?: boolean;
  }): Promise<{
    data: any[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const { page = 1, pageSize = 20, experienceId, isActive } = params;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (experienceId !== undefined) where.experienceId = experienceId;
    if (isActive !== undefined) where.isActive = isActive;

    const { data, total } = await this.addressableRepository.findMany({
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
    const addressable = await this.addressableRepository.findById(id);
    if (!addressable) {
      throw new NotFoundException(`Addressable with ID ${id} not found`);
    }
    return addressable;
  }

  async findByExperienceId(experienceId: number): Promise<any> {
    const addressable = await this.addressableRepository.findByExperienceId(experienceId);
    if (!addressable) {
      throw new NotFoundException(`Addressable for experience ${experienceId} not found`);
    }

    // Return Unity-specific format
    return {
      experienceId: addressable.experienceId,
      currentVersion: addressable.version,
      bundleUrl: addressable.bundleUrl,
      catalogUrl: addressable.catalogUrl,
      sizeMb: addressable.sizeMb,
      updatedAt: addressable.updatedAt.toISOString(),
    };
  }

  async create(dto: CreateAddressableDto): Promise<any> {
    return this.addressableRepository.create({
      experience: { connect: { id: dto.experienceId } },
      bundleUrl: dto.bundleUrl,
      version: dto.version,
      sizeMb: dto.sizeMb,
      catalogUrl: dto.catalogUrl,
      isActive: dto.isActive,
    });
  }

  async update(id: number, dto: UpdateAddressableDto): Promise<any> {
    const addressable = await this.addressableRepository.findById(id);
    if (!addressable) {
      throw new NotFoundException(`Addressable with ID ${id} not found`);
    }

    return this.addressableRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    const addressable = await this.addressableRepository.findById(id);
    if (!addressable) {
      throw new NotFoundException(`Addressable with ID ${id} not found`);
    }

    await this.addressableRepository.delete(id);
  }
}