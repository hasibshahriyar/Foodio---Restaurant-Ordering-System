import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}