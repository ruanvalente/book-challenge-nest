import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { Book } from 'src/modules/books/entities/book.entity';

export class CreateAuthorRequestDTO {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  birthDate: Date;

  @IsOptional()
  @IsArray()
  books?: Book[];
}
