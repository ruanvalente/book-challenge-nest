import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRegistrationRequestDTO } from 'src/entities/dto/request/user-registration-request-dto';
import { UserRegistrationResponseDTO } from 'src/entities/dto/response/user-registration-response-dto';
import { UserRole } from 'src/entities/enums/role.enum';
import { UserService } from '../services/user.service';
import { AuthService } from 'src/infra/auth/services/auth.service';

@Controller('/api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listUsers(): Promise<any> {
    return this.userService.findAll();
  }

  @Post('register')
  async registerUser(
    @Body() data: UserRegistrationRequestDTO,
  ): Promise<UserRegistrationResponseDTO> {
    console.log('register user', data);

    const userResponse = await this.userService.registerUser(
      data.name,
      data.email,
      data.password,
      UserRole.USER,
    );

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
