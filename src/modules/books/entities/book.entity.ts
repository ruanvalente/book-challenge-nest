import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Author } from '../../users/entities/author.entity';

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

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
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

  @ManyToMany(() => Author, (author) => author.books)
  authors: Author[];
}
