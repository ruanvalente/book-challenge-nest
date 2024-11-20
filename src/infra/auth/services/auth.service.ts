import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { UserRole } from 'src/modules/users/entities/enums/role.enum';
import { Users } from 'src/modules/users/entities/users.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async register(
    name: string,
    email: string,
    role: UserRole,
    password: string,
  ): Promise<Users> {
    this.logger.log(`Tentando cadastrar usuário com email: ${email}`);
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      this.logger.warn(
        `Falha ao registrar o e-mail ${email} - Usuário já existe`,
      );
      throw new ConflictException('Nome do usuário já existente');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    this.logger.debug(`Senha criptografada com sucesso para e-mail: ${email}`);

    const newUser = this.userRepository.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    this.logger.log(`Usuário registrado com sucesso com o e-mail: ${email}`);
    return savedUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    this.logger.log(`Tentando login para o e-mail: ${email}`);
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.warn(
        `Falha no login para o email: ${email} - Credencias inválidas`,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }

    this.logger.debug(`Login successful for email: ${email}`);
    const payload = { username: user.name, sub: user.id, role: user.role };

    const secret = this.configService.get<string>(
      'JWT_SECRET',
      'default_secret',
    );
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '60m');

    this.logger.debug(
      `Gerado o JWT para o usuário: ${user.name} (ID: ${user.id})`,
    );
    const token = this.jwtService.sign(payload, {
      secret,
      algorithm: 'HS256',
      expiresIn,
    });

    this.logger.log(`Token gerado com sucesso para o email: ${email}`);
    return {
      access_token: token,
    };
  }
}
