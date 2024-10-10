import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { OrderItemDTO } from './order-item-dto';

export class CreateOrderRequestDTO {
  @IsString()
  @IsNotEmpty()
  client: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  orderItems: OrderItemDTO[];
}
