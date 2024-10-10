import { Author } from 'src/modules/authors/entities/author.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

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
}
