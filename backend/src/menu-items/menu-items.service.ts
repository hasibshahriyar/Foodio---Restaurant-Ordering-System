import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, ILike } from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

export interface MenuItemsQuery {
  search?: string;
  categoryId?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name';
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemsRepository: Repository<MenuItem>,
  ) {}

  async findAll(query: MenuItemsQuery = {}) {
    const {
      search,
      categoryId,
      isAvailable,
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = query;

    const where: any = {};
    if (search) where.name = ILike(`%${search}%`);
    if (categoryId) where.categoryId = categoryId;
    if (isAvailable !== undefined) where.isAvailable = isAvailable;

    const [items, total] = await this.menuItemsRepository.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<MenuItem> {
    const item = await this.menuItemsRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async create(dto: CreateMenuItemDto, imageFilename?: string): Promise<MenuItem> {
    const item = this.menuItemsRepository.create({
      ...dto,
      image: imageFilename ? `/uploads/${imageFilename}` : undefined,
    });
    return this.menuItemsRepository.save(item) as Promise<MenuItem>;
  }

  async update(id: string, dto: UpdateMenuItemDto, imageFilename?: string): Promise<MenuItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    if (imageFilename) item.image = `/uploads/${imageFilename}`;
    return this.menuItemsRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.menuItemsRepository.remove(item);
  }

  async findByIds(ids: string[]): Promise<MenuItem[]> {
    return this.menuItemsRepository.find({ where: ids.map((id) => ({ id })) });
  }
}
