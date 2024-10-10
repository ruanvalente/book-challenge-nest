import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/entities/book.entity';
import { OrdersController } from './controller/orders.controller';
import { Order } from './entities/order.entity';
import { OrderedItem } from './entities/ordered-item.entity';
import { OrdersService } from './services/orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderedItem, Book])],
  controllers: [OrdersController],
  exports: [OrdersService],
  providers: [OrdersService],
})
export class OrdersModule {}
