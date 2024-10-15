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

import { CreateOrderRequestDTO } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../services/orders.service';

@Controller('api/orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria uma nova ordem' })
  @ApiBody({
    type: CreateOrderRequestDTO,
    description: 'Objeto com os dados para criação de uma ordem',
  })
  @ApiResponse({
    status: 201,
    description: 'Ordem criada com sucesso.',
    type: Order,
  })
  @ApiResponse({
    status: 400,
    description: 'Não foi possível realizar a criação da ordem.',
  })
  @ApiResponse({
    status: 422,
    description: 'Os dados fornecidos não são válidos.',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro interno.',
  })
  create(@Body() data: CreateOrderRequestDTO) {
    return this.ordersService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Obtem uma lista de ordens de forma paginada' })
  @ApiResponse({
    status: 200,
    description: 'Ordens obtidas com sucesso.',
    type: Order,
  })
  @ApiResponse({
    status: 400,
    description: 'Não foi possível realizar a consulta.',
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhuma ordem encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro interno.',
  })
  @ApiParam({
    name: 'page',
    type: 'integer',
    required: false,
    description: 'Número da página a ser retornada',
  })
  @ApiParam({
    name: 'limit',
    required: false,
    type: 'integer',
    description: 'Quantidade de ordens a serem retornadas por página',
  })
  @ApiParam({
    name: 'currentPage',
    required: false,
    type: 'integer',
    description: 'Número da página atual',
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('currentPage') currentPage: number = Number(page),
  ): Promise<{
    data: Order[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.ordersService.findAll(page, limit, currentPage);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Obtem uma ordem pelo seu ID' })
  @ApiResponse({
    status: 200,
    description: 'Ordem encontrada.',
    type: Order,
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem não encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro interno.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem a ser retornada',
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(Number(id));
  }

  @Patch(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza uma ordem pelo seu ID' })
  @ApiResponse({
    status: 200,
    description: 'Ordem atualizada com sucesso.',
    type: Order,
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem não encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro interno.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem a ser atualizada',
  })
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Objeto com os dados do autor para atualização',
  })
  update(@Param('id') id: string, @Body() data: UpdateOrderDto) {
    return this.ordersService.update(Number(id), data);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove uma ordem pelo seu ID' })
  @ApiResponse({
    status: 204,
    description: 'Ordem removida com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ordem não encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro interno.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem a ser removida',
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(Number(id));
  }
}
