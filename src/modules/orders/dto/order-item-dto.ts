import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItemDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'ID do livro',
  })
  bookId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 10,
    description: 'Quantidade do livro',
  })
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 50.9,
    description: 'Preço unitário do livro',
  })
  priceUnitary: number;
}
