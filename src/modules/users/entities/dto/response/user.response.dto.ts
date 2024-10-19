import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { UserRole } from '../../enums/role.enum';

export class UserResponseDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'ID do usuário',
  })
  id: number;

  @IsNotEmpty()
  @ApiProperty({
    example: 'joe.smith@example.com',
    description: 'Email do usuário',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'email.smith@example.com',
    description: 'Seu email de usuário',
  })
  email: string;

  @IsOptional()
  @ApiProperty({
    example: '2024-10-19T18:03:44.000Z',
    description: 'Data de criação do usuário',
    required: false,
  })
  createdAt: string;

  @IsOptional()
  @ApiProperty({
    example: UserRole.CLIENT,
    description: 'Role do usuário',
    required: false,
  })
  role: UserRole;
}
