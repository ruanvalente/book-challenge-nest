import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

import { Book } from 'src/modules/books/entities/book.entity';

export class CreateAuthorRequestDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 'George R. R. Martin',
    description: 'Nome do autor',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    example: 'A biography of a renowned American author',
    description: 'Bio do autor',
    required: false,
  })
  bio: string;

  @IsOptional()
  @ApiProperty({
    example: '1955-05-21',
    description: 'Data de nascimento do autor',
    required: false,
  })
  birthDate: Date;

  @IsOptional()
  @IsArray()
  books?: Book[];
}
