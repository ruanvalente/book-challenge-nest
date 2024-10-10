import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderRequestDTO } from '../dto/create-order.dto';
import { OrdersService } from '../services/orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() data: CreateOrderRequestDTO) {
    return this.ordersService.create(data);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ordersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
