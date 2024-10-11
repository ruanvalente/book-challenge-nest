import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { OrderItemDTO } from './order-item-dto';

export class CreateOrderRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Joe Doe',
    description: 'Nome do cliente',
  })
  client: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  @ApiProperty({
    type: OrderItemDTO,
    description: 'Itens do pedido',
  })
  orderItems: OrderItemDTO[];
}
