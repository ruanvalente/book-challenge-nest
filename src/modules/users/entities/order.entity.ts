import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderedItem } from './ordered-item.entity';

@Entity('tb_order')
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  client: string;

  @Column({ type: 'timestamp' })
  orderDateTime: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @OneToMany(() => OrderedItem, (orderedItem) => orderedItem.order, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  orderItems: OrderedItem[];

  calculateAmountValue() {
    this.totalAmount = this.orderItems
      .map((item) => item.priceUnitary * item.quantity)
      .reduce((acc, curr) => acc + curr, 0);
  }
}
