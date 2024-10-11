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

import { CreateAuthorRequestDTO } from '../dto/request/create-author-request.dto';
import { Author } from '../entities/author.entity';
import { AuthorsService } from '../services/authors.service';

@Controller('api/authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  async create(@Body() data: CreateAuthorRequestDTO) {
    return await this.authorsService.create(data);
  }

  @Get()
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
  async findOne(@Param('id') id: string) {
    return await this.authorsService.findOne(Number(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Author) {
    return await this.authorsService.update(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.authorsService.remove(Number(id));
  }
}
