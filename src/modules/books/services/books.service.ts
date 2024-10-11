import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Author } from 'src/modules/authors/entities/author.entity';

import { CreateBookRequestDTO } from '../dto/request/book-create-request.dto';
import { BestSellerResponseBookDTO } from '../dto/response/best-sellers-respose.dto';
import { Book } from '../entities/book.entity';
import { BookFilterUtils } from '../utils/book-filters.utils';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,

    private readonly bookFilterUtils: BookFilterUtils,
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
    minPrice?: number,
    maxPrice?: number,
    sortBy: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{
    data: Book[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const where = await this.bookFilterUtils.buildWhereClause(
      title,
      category,
      author,
      minPrice,
      maxPrice,
    );

    const [data, total] = await this.bookRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: sortBy },
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

  async findBestSellingBooks(
    limit: number = 10,
  ): Promise<BestSellerResponseBookDTO[]> {
    const bestSellers = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.orderedItems', 'orderedItem')
      .select([
        'book.id',
        'book.title',
        'book.price',
        'book.createdAt',
        'book.category',
        'book.stock',
      ])
      .addSelect('SUM(orderedItem.quantity)', 'totalSold')
      .groupBy('book.id')
      .orderBy('totalSold', 'DESC')
      .limit(limit)
      .getRawMany();

    return bestSellers.map(
      (item) =>
        new BestSellerResponseBookDTO({
          id: item.book_id,
          title: item.book_title,
          price: item.book_price,
          category: item.book_category,
          stock: item.book_stock,
          totalSold: Number(item.totalSold),
        }),
    );
  }
}
