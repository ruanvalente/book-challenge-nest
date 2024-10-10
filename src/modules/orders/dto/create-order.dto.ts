import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
