import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('tb_autor')
export class Author {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'date' })
  birthDate: string;

  @ManyToMany(() => Book)
  @JoinTable({
    name: 'book_author',
    joinColumn: { name: 'author_id' },
    inverseJoinColumn: { name: 'book_id' },
  })
  books: Book[];
}
