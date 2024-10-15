import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/infra/auth/guards/decorators/roles.decorator';
import { JwtGuard } from 'src/infra/auth/guards/jwt.guard';
import { RolesGuard } from 'src/infra/auth/guards/roles.guard';

import { UserRole } from 'src/modules/users/entities/enums/role.enum';

import { CreateBookRequestDTO } from '../dto/request/book-create-request.dto';
import { BestSellerResponseBookDTO } from '../dto/response/best-sellers-respose.dto';
import { Book } from '../entities/book.entity';
import { BooksService } from '../services/books.service';

@ApiTags('books')
@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('best-sellers')
  @ApiOperation({ summary: 'Obtem uma lista os livros mais vendidos' })
  @ApiParam({
    name: 'limit',
    description:
      'Valor para limitar a quantidade de dados a serem retornados na consulta',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de livros mais vendidos retornada com sucesso.',
    type: [BestSellerResponseBookDTO],
  })
  async findBestSellers(
    @Query('limit') limit: number = 10,
  ): Promise<BestSellerResponseBookDTO[]> {
    return await this.booksService.findBestSellingBooks(limit);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar um novo livro' })
  @ApiBody({ description: 'Dados do novo livro', type: CreateBookRequestDTO })
  @ApiResponse({
    status: 201,
    description: 'Livro criado com sucesso.',
    type: Book,
  })
  create(@Body() data: CreateBookRequestDTO) {
    return this.booksService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Obtem a lista de livros de forma paginada' })
  @ApiParam({
    name: 'page',
    description: 'Valor da página desejada',
    required: false,
  })
  @ApiParam({
    name: 'limit',
    required: false,
    description:
      'Valor para limitar a quantidade de dados a serem retornados na consulta',
  })
  @ApiParam({
    name: 'currentPage',
    description: 'Valor para página atual',
    required: false,
  })
  @ApiParam({
    name: 'title',
    description: 'Valor para para a título',
    required: false,
  })
  @ApiParam({
    name: 'category',
    description: 'Valor para para a categoria',
    required: false,
  })
  @ApiParam({
    name: 'author',
    description: 'Valor para para o autor',
    required: false,
  })
  @ApiParam({
    name: 'minPrice',
    required: false,
    description: 'Valor para pesquisar através do valor mínimo do livro',
  })
  @ApiParam({
    name: 'maxPrice',
    required: false,
    description: 'Valor para pesquisar através do valor máximo do livro',
  })
  @ApiParam({
    name: 'sortBy',
    required: false,
    description:
      'Valor para ordenação baseado dos dados de forma ascendente / crescente',
  })
  @ApiResponse({ status: 200, description: 'Livro encontrado.', type: Book })
  @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
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
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Obtem um livro pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do livro a ser retornado' })
  @ApiResponse({ status: 200, description: 'Livro encontrado.', type: Book })
  @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza um livro pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do livro a ser atualizado' })
  @ApiResponse({
    status: 201,
    description: 'Livro atualizado com sucesso.',
    type: Book,
  })
  @ApiResponse({ status: 200, description: 'Livro encontrado.', type: Book })
  @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
  update(@Param('id') id: number, @Body() data: Book) {
    return this.booksService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove um livro pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do livro a ser removido' })
  @ApiResponse({
    status: 204,
    description: '',
  })
  @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.booksService.remove(id);
  }
}
