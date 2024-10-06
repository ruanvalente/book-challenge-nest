import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/entities/enums/role.enum'; // Ajuste o caminho conforme necessário
import * as bcrypt from 'bcryptjs';

import { Users } from 'src/entities/users.entity';
import { UserRepository } from 'src/users/repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: UserRepository,
  ) {}

  async registerUser(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<Users> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  }

  async findByEmail(email: string): Promise<Users | undefined> {
    return this.userRepository.findByEmail(email);
  }

  async findAll(): Promise<Users[]> {
    return this.userRepository.findAll();
  }
}
