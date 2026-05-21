import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../orders/order.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  async createPaymentIntent(amount: number, currency: string, orderId?: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
      metadata: { orderId: orderId || '' },
    });

    if (orderId) {
      const order = await this.ordersRepository.findOne({ where: { id: orderId } });
      if (!order) throw new NotFoundException('Order not found');
      order.status = OrderStatus.PREPARING;
      await this.ordersRepository.save(order);
    }

    return { clientSecret: paymentIntent.client_secret };
  }
}