import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/infra/auth/services/auth.service';

import { UserRegistrationRequestDTO } from '../entities/dto/request/user-registration-request-dto';
import { UserRegistrationResponseDTO } from '../entities/dto/response/user-registration-response-dto';
import { UserService } from '../services/user.service';

@Controller('/api/users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('list')
  @ApiOperation({ summary: 'Lista os usuãrios cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Usuários cadastrados.',
    type: UserRegistrationResponseDTO,
  })
  async listUsers(): Promise<any> {
    return this.userService.findAll();
  }

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar um novo usuário' })
  @ApiBody({
    description: 'Dados para criação de um novo usuário',
    type: UserRegistrationRequestDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário cadastrado com sucesso.',
    type: UserRegistrationResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Não foi possível realizar o cadastro do usuário.',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro interno.',
  })
  async registerUser(
    @Body() data: UserRegistrationRequestDTO,
  ): Promise<UserRegistrationResponseDTO> {
    const userResponse = await this.userService.registerUser(data);

    const token = await this.authService.generateToken(userResponse);

    const responseDTO = new UserRegistrationResponseDTO(
      userResponse.id,
      userResponse.name,
      userResponse.email,
      userResponse.role,
      token,
    );

    return responseDTO;
  }
}
