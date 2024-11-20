import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Author } from 'src/modules/authors/entities/author.entity';

import { CreateBookRequestDTO } from '../dto/request/book-create-request.dto';
import { BestSellerResponseBookDTO } from '../dto/response/best-sellers-respose.dto';
import { Book } from '../entities/book.entity';
import { BookFilterUtils } from '../utils/book-filters.utils';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private readonly bookFilterUtils: BookFilterUtils,
  ) {}

  async create(createBookDTO: CreateBookRequestDTO): Promise<Book> {
    try {
      const book = await this.bookRepository.save(createBookDTO);
      return book;
    } catch (error) {
      this.logger.error('Erro ao criar um livro', error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o livro. Tente novamente mais tarde.',
      );
    }
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
    try {
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
    } catch (error) {
      this.logger.error('Erro ao buscar livros', error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar os livros. Tente novamente mais tarde.',
      );
    }
  }

  async findOne(id: number): Promise<Book> {
    try {
      const book = await this.bookRepository.findOne({ where: { id } });
      if (!book) {
        throw new NotFoundException(`Livro com ID ${id} não encontrado`);
      }
      return book;
    } catch (error) {
      this.logger.error(`Erro ao buscar o livro com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar o livro. Tente novamente mais tarde.',
      );
    }
  }

  async update(id: number, data: Book): Promise<Book> {
    try {
      const book = await this.bookRepository.findOne({
        where: { id },
        relations: ['authors'],
      });

      if (!book) {
        throw new NotFoundException(`Livro com ID ${id} não encontrado`);
      }

      if (data.authors) {
        const authors = await this.authorRepository.findBy(data.authors);
        book.authors = authors;
      }

      Object.assign(book, data);

      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      this.logger.error(`Erro ao atualizar o livro com ID ${id}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o livro. Tente novamente mais tarde.',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const book = await this.bookRepository.findOne({ where: { id } });

      if (!book) {
        throw new NotFoundException(`Livro com ID ${id} não encontrado`);
      }

      await this.bookRepository.delete(id);
    } catch (error) {
      this.logger.error(`Erro ao remover o livro com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao remover o livro. Tente novamente mais tarde.',
      );
    }
  }

  async findBestSellingBooks(
    limit: number = 10,
  ): Promise<BestSellerResponseBookDTO[]> {
    try {
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
    } catch (error) {
      this.logger.error('Erro ao buscar os livros mais vendidos', error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar os livros mais vendidos. Tente novamente mais tarde.',
      );
    }
  }
}
