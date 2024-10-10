import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorsController } from './controller/authors.controller';
import { AuthorsService } from './services/authors.service';

import { Book } from '../books/entities/book.entity';
import { Author } from './entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  controllers: [AuthorsController],
  exports: [AuthorsService],
  providers: [AuthorsService],
})
export class AuthorsModule {}
