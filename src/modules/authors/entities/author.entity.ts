import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Book } from 'src/modules/books/entities/book.entity';

@Entity('tb_autor')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    example: 'George R. R. Martin',
    description: 'Nome do autor',
    required: true,
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'A biography of a renowned American author',
    description: 'Bio do autor',
    required: false,
  })
  bio: string;

  @Column({
    type: 'date',
    default: () => null,
    nullable: true,
  })
  @ApiProperty({
    example: '1955-05-21',
    description: 'Data de nascimento do autor',
    required: false,
  })
  birthDate: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: string;

  @ManyToMany(() => Book, (book) => book.authors)
  @JoinTable({
    name: 'book_author',
    joinColumn: { name: 'author_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'book_id', referencedColumnName: 'id' },
  })
  books: Book[];
}
