import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controller/orders.controller';
import { OrderedItem } from './entities/ordered-item.entity';
import { Order } from './entities/order.entity';
import { Book } from '../books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderedItem, Book])],
  controllers: [OrdersController],
  exports: [OrdersService],
  providers: [OrdersService],
})
export class OrdersModule {}
