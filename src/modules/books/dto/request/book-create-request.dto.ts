import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { Author } from 'src/modules/users/entities/author.entity';

export class CreateBookRequestDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  isbn: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  stock: number;

  @IsOptional()
  @IsArray()
  authors?: Author[];
}
