import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/infra/auth/services/auth.service';

import { UserRole } from 'src/modules/users/entities/enums/role.enum';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({
    schema: {
      example: {
        name: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso.',
  })
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('role') role: UserRole,
    @Body('password') password: string,
  ) {
    return this.authService.register(name, email, role, password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar e gerar um token JWT' })
  @ApiBody({
    schema: {
      example: { email: 'john@example.com', password: 'password123' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido. Token JWT retornado.',
  })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }
}
