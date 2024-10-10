import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemDTO {
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  priceUnitary: number;
}
