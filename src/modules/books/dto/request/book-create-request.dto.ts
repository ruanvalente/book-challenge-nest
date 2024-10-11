import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

import { Author } from 'src/modules/authors/entities/author.entity';

export class CreateBookRequestDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 'The Great Gatsby',
    description: 'O título do livro',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '978-3-16-148410-0',
    description: 'O ISBN do livro',
  })
  isbn: string;

  @IsOptional()
  @ApiProperty({
    example: 'A simple description for the book request',
    description: 'Descrição do livro',
  })
  description: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '50.90',
    description: 'Valor do livro',
  })
  price: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Fiction',
    description: 'Categoria do livro',
  })
  category: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '100',
    description: 'Valor em estoque',
  })
  stock: number;

  @IsOptional()
  @IsArray()
  authors?: Author[];
}
