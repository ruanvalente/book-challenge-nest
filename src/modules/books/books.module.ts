import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../authors/entities/author.entity';
import { BooksController } from './controller/books.controller';
import { Book } from './entities/book.entity';
import { BooksService } from './services/books.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Author])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
