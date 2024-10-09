import { Module } from '@nestjs/common';
import { BooksService } from './services/books.service';
import { BooksController } from './controller/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../authors/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
