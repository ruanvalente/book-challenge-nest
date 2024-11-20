import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from 'src/modules/books/entities/book.entity';

import { Author } from '../entities/author.entity';

@Injectable()
export class AuthorsService {
  private readonly logger = new Logger(AuthorsService.name);

  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(data: any): Promise<Author> {
    try {
      const author = await this.authorRepository.save(data);
      return author;
    } catch (error) {
      this.logger.error('Erro ao criar um autor', error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o autor. Tente novamente mais tarde.',
      );
    }
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
    try {
      const [data, total] = await this.authorRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        order: { createdAt: 'DESC' },
      });
      const totalPages: number = Math.ceil(total / limit);

      return { data, total, currentPage, totalPages };
    } catch (error) {
      this.logger.error('Erro ao buscar autores', error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar os autores. Tente novamente mais tarde.',
      );
    }
  }

  async findOne(id: number): Promise<Author> {
    try {
      const author = await this.authorRepository.findOne({ where: { id } });
      if (!author) {
        throw new NotFoundException(`Author com ID ${id} não encontrado`);
      }
      return author;
    } catch (error) {
      this.logger.error(`Erro ao buscar o autor com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar o autor. Tente novamente mais tarde.',
      );
    }
  }

  async update(id: number, data: Author): Promise<Author> {
    try {
      const author = await this.authorRepository.findOne({ where: { id } });
      if (!author) {
        throw new NotFoundException(`Author com ID ${id} não encontrado`);
      }

      if (data.books) {
        const books = await this.bookRepository.findBy(data.books);
        author.books = books;
      }

      Object.assign(author, data);
      await this.authorRepository.save(author);

      return author;
    } catch (error) {
      this.logger.error(`Erro ao atualizar o autor com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o autor. Tente novamente mais tarde.',
      );
    }
  }

  async remove(id: number) {
    try {
      const author = await this.authorRepository.findOne({ where: { id } });

      if (!author) {
        throw new NotFoundException(`Author com ID ${id} não encontrado`);
      }

      await this.authorRepository.delete(id);
    } catch (error) {
      this.logger.error(`Erro ao remover o autor com ID ${id}`, error.stack);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao remover o autor. Tente novamente mais tarde.',
      );
    }
  }
}
