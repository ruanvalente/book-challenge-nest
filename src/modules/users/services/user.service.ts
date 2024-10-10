import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async registerUser({
    name,
    password,
    email,
    role,
  }: Partial<Users>): Promise<Users> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.save({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  }

  async findByEmail(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }
}
