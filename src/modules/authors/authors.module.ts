import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/infra/auth/auth.module';

import { Book } from '../books/entities/book.entity';
import { AuthorsController } from './controller/authors.controller';
import { Author } from './entities/author.entity';
import { AuthorsService } from './services/authors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book]), AuthModule],
  controllers: [AuthorsController],
  exports: [AuthorsService],
  providers: [AuthorsService],
})
export class AuthorsModule {}
