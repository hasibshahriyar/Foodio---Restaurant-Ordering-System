import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { User } from '../users/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private menuItemsService: MenuItemsService,
  ) {}

  async create(dto: CreateOrderDto, user: User): Promise<Order> {
    const menuItemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.menuItemsService.findByIds(menuItemIds);

    const itemMap = new Map(menuItems.map((m) => [m.id, m]));

    for (const item of dto.items) {
      const menuItem = itemMap.get(item.menuItemId);
      if (!menuItem) throw new BadRequestException(`Menu item ${item.menuItemId} not found`);
      if (!menuItem.isAvailable) throw new BadRequestException(`${menuItem.name} is not available`);
    }

    const orderItems: OrderItem[] = dto.items.map((item) => {
      const menuItem = itemMap.get(item.menuItemId)!;
      const oi = new OrderItem();
      oi.menuItemId = item.menuItemId;
      oi.quantity = item.quantity;
      oi.price = Number(menuItem.price);
      return oi;
    });

    const totalAmount = orderItems.reduce(
      (sum, oi) => sum + oi.price * oi.quantity,
      0,
    );

    const order = this.ordersRepository.create({
      userId: user.id,
      items: orderItems,
      totalAmount,
      deliveryAddress: dto.deliveryAddress || user.address,
    });

    return this.ordersRepository.save(order);
  }

  async findMyOrders(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.ordersRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = dto.status;
    return this.ordersRepository.save(order);
  }
}
