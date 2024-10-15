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

import { CreateAuthorRequestDTO } from '../dto/request/create-author-request.dto';
import { Author } from '../entities/author.entity';
import { AuthorsService } from '../services/authors.service';

@Controller('api/authors')
@ApiTags('author')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria um novo autor' })
  @ApiParam({
    name: 'data',
    description: 'Objeto com os para criação do autor',
    type: CreateAuthorRequestDTO,
  })
  async create(@Body() data: CreateAuthorRequestDTO) {
    return await this.authorsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Obtem a lista de autores' })
  @ApiParam({
    name: 'page',
    description: 'Valor da página desejada',
    required: false,
    type: 'integer',
  })
  @ApiParam({
    name: 'limit',
    description:
      'Valor para limitar a quantidade de dados a serem retornados na consulta',
    required: false,
    type: 'integer',
  })
  @ApiParam({
    name: 'currentPage',
    description: 'Valor para página atual',
    required: false,
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Autores retornados com sucesso.',
    type: [Author],
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum autor encontrado.',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('currentPage') currentPage: number = Number(page),
  ): Promise<{
    data: Author[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    return await this.authorsService.findAll(page, limit, currentPage);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Obtem um autor pelo seu ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do autor a ser retornado',
    type: 'integer',
  })
  @ApiResponse({ status: 200, description: 'Autor encontrado.', type: Author })
  @ApiResponse({ status: 404, description: 'Autor não encontrado.' })
  async findOne(@Param('id') id: string) {
    return await this.authorsService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza um autor pelo seu ID' })
  @ApiBody({
    description: 'Objeto com os dados do autor para atualização',
    type: Author,
  })
  @ApiParam({
    name: 'id',
    description: 'ID do autor a ser atualizado',
    type: 'integer',
  })
  @ApiResponse({
    status: 201,
    description: 'Autor atualizado com sucesso.',
    type: Author,
  })
  @ApiResponse({ status: 404, description: 'Autor não encontrado.' })
  async update(@Param('id') id: string, @Body() data: Author) {
    return await this.authorsService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove um autor pelo seu ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do autor a ser removido',
    type: 'integer',
  })
  @ApiResponse({ status: 200, description: '' })
  @ApiResponse({ status: 404, description: 'Autor não encontrado.' })
  async remove(@Param('id') id: string) {
    return await this.authorsService.remove(Number(id));
  }
}
