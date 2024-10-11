import { ApiProperty } from '@nestjs/swagger';

export class UserRegistrationResponseDTO {
  @ApiProperty({
    example: 1,
    description: 'ID do usuário',
  })
  id: number;
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do usuário',
  })
  name: string;
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário',
  })
  email: string;
  @ApiProperty({
    example: 'USER | ADMIN',
    description: 'Role do usuário',
  })
  role: string;
  @ApiProperty({
    example: 'your_jwt_token',
    description: 'Token JWT para autenticação',
  })
  token?: string;

  constructor(
    id: number,
    name: string,
    email: string,
    role: string,
    token?: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.token = token;
  }
}
