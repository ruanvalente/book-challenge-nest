import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Author } from 'src/modules/authors/entities/author.entity';
import { OrderedItem } from 'src/modules/orders/entities/ordered-item.entity';

@Entity('tb_book')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  isbn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal')
  price: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: string;

  @Column()
  category: string;

  @Column('int')
  stock: number;

  @ManyToMany(() => Author, (author) => author.books, { cascade: true })
  authors: Author[];

  @OneToMany(() => OrderedItem, (orderItem) => orderItem.book)
  orderedItems: OrderedItem[];
}
