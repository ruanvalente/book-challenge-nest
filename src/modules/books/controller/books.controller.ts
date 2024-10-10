import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateBookRequestDTO } from '../dto/request/book-create-request.dto';
import { Book } from '../entities/book.entity';
import { BooksService } from '../services/books.service';

@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() data: CreateBookRequestDTO) {
    return this.booksService.create(data);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('currentPage') currentPage: number = Number(page),
    @Query('title') title: string = '',
    @Query('category') category: string = '',
    @Query('author') author: string = '',
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{
    data: Book[];
    total: number;
    totalPages: number;
    currentPage: number;
    title?: string;
    category?: string;
    author?: string;
  }> {
    return this.booksService.findAll(
      page,
      limit,
      currentPage,
      title,
      category,
      author,
      minPrice,
      maxPrice,
      sortBy,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: Book) {
    return this.booksService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.booksService.remove(id);
  }
}
