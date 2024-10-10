import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/modules/authors/entities/author.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateBookRequestDTO } from '../dto/request/book-create-request.dto';
import { Book } from '../entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(createBookDTO: CreateBookRequestDTO): Promise<Book> {
    const book = await this.bookRepository.save(createBookDTO);
    return book;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    currentPage: number = 1,
    title?: string,
    category?: string,
    author?: string,
  ): Promise<{
    data: Book[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const where: FindOptionsWhere<Book> = {};

    if (title) {
      where.title = title.trim();
    }

    if (category) {
      where.category = category.trim();
    }

    if (author) {
      const authors = await this.authorRepository.find({
        where: { name: author.trim() },
      });
      if (authors.length) {
        where.authors = authors;
      }
    }

    const [data, total] = await this.bookRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages: number = Math.ceil(total / limit);

    return { data, total, currentPage, totalPages };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, data: Book): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['authors'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (data.authors) {
      const authors = await this.authorRepository.findBy(data.authors);
      book.authors = authors;
    }

    Object.assign(book, data);

    await this.bookRepository.save(book);

    return book;
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    await this.bookRepository.delete(id);
  }
}
