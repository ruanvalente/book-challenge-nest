import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderRequestDTO } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderRequestDTO) {}
