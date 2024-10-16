import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/infra/auth/guards/decorators/roles.decorator';
import { JwtGuard } from 'src/infra/auth/guards/jwt.guard';
import { RolesGuard } from 'src/infra/auth/guards/roles.guard';

import { UserRole } from '../entities/enums/role.enum';
import { Users } from '../entities/users.entity';
import { UserService } from '../services/user.service';

@Controller('api/users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Obtem a lista de usuários' })
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
    description: 'Usuários retornados com sucesso.',
    type: [Users],
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
    data: Users[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    return await this.userService.findAll(page, limit, currentPage);
  }

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Obtem um usuário pelo seu ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser retornado',
    type: 'integer',
  })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.', type: Users })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(Number(id));
  }
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Atualiza um usuário pelo seu id' })
  @ApiBody({
    description: 'Objeto com os dados do usuário para atualização',
    type: Users,
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser atualizado',
    type: 'integer',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário atualizado com sucesso.',
    type: Users,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async update(@Param('id') id: string, @Body() data: Users) {
    return await this.userService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Remove um usuário pelo seu ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser removido',
    type: 'integer',
  })
  @ApiResponse({ status: 201, description: '' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async delete(@Param('id') id: string) {
    return await this.userService.delete(Number(id));
  }
}
