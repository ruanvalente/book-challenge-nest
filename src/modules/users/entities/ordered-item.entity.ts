import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Order } from './order.entity';
import { Book } from './book.entity';

@Entity('tb_order_item')
export class OrderedItem {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Book, { nullable: false })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceUnitary: number;
}
