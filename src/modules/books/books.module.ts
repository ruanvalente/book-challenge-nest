import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/infra/auth/auth.module';

import { Author } from '../authors/entities/author.entity';
import { BooksController } from './controller/books.controller';
import { Book } from './entities/book.entity';
import { BooksService } from './services/books.service';
import { BookFilterUtils } from './utils/book-filters.utils';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author]), AuthModule],
  controllers: [BooksController],
  providers: [BooksService, BookFilterUtils],
  exports: [BooksService],
})
export class BooksModule {}
