import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorsService } from './services/authors.service';
import { AuthorsController } from './controller/authors.controller';

import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  controllers: [AuthorsController],
  exports: [AuthorsService],
  providers: [AuthorsService],
})
export class AuthorsModule {}
