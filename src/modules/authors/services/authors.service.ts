import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from 'src/modules/books/entities/book.entity';

import { Author } from '../entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}
  async create(data: any): Promise<Author> {
    const author = await this.authorRepository.save(data);

    return author;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    currentPage: number = 1,
  ): Promise<{
    data: Author[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const [data, total] = await this.authorRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });
    const totalPages: number = Math.ceil(total / limit);

    return { data, total, currentPage, totalPages };
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async update(id: number, data: Author): Promise<Author> {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    if (data.books) {
      const authors = await this.bookRepository.findBy(data.books);
      author.books = authors;
    }

    Object.assign(author, data);

    await this.authorRepository.save(author);

    return author;
  }

  async remove(id: number) {
    const author = await this.authorRepository.findOne({ where: { id } });

    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }

    await this.authorRepository.delete(id);
  }
}
