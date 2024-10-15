import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { UserRole } from '../../enums/role.enum';

export class UserRegistrationRequestDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do usuário',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'password123',
    description: 'Senha do usuário',
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    example: UserRole.CLIENT,
    description: 'Role do usuário',
    required: false,
  })
  role?: UserRole;
}
