import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Author } from './author';

@Entity('tb_book')
export class Book {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  isbn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal')
  price: number;

  @Column({ type: 'date' })
  createdAt: string;

  @Column()
  category: string;

  @Column('int')
  estoque: number;

  @ManyToMany(() => Author, (author) => author.books, { cascade: true })
  authors: Author[];
}
