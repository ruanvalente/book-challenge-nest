import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { Author } from 'src/modules/authors/entities/author.entity';

import { Book } from '../entities/book.entity';

export class BookFilterUtils {
  static authorRepository: any;
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async buildWhereClause(
    title?: string,
    category?: string,
    author?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<FindOptionsWhere<Book>> {
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

    this.addPriceFilter(where, minPrice, maxPrice);

    return where;
  }

  private addPriceFilter(
    where: FindOptionsWhere<Book>,
    minPrice?: number,
    maxPrice?: number,
  ): void {
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice !== undefined) {
      where.price = LessThanOrEqual(maxPrice);
    }
  }
}
