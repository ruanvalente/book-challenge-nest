import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { OrderedItem } from './ordered-item.entity';

@Entity('tb_order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  orderDateTime: string;

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
