import {
  ConflictException,
  Injectable,
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
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      email,
      role,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.name, sub: user.id, role: user.role };

    const secret = this.configService.get<string>(
      'JWT_SECRET',
      'default_secret',
    );
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '60m');

    const token = this.jwtService.sign(payload, {
      secret,
      algorithm: 'HS256',
      expiresIn,
    });

    return {
      access_token: token,
    };
  }
}
