import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from 'src/infra/auth/services/auth.service';

import { UserRegistrationRequestDTO } from '../entities/dto/request/user-registration-request-dto';
import { UserRegistrationResponseDTO } from '../entities/dto/response/user-registration-response-dto';
import { UserService } from '../services/user.service';

@Controller('/api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('list')
  async listUsers(): Promise<any> {
    return this.userService.findAll();
  }

  @Post('register')
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
