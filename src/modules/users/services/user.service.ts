import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { UserResponseDTO } from '../entities/dto/response/user.response.dto';
import { Users } from '../entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(data: Users): Promise<Users> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    const user = await this.userRepository.save(data);
    return user;
  }
  async findAll(
    page: number = 1,
    limit: number = 10,
    currentPage: number = 1,
  ): Promise<{
    data: UserResponseDTO[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const [data, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });
    const totalPages: number = Math.ceil(total / limit);

    const userResponseData = data.map((user) => {
      const { id, name, email, role, createdAt } = user;
      return {
        id,
        name,
        email,
        role,
        createdAt,
      };
    });

    return { data: userResponseData, total, currentPage, totalPages };
  }

  async findByEmail(email: string): Promise<UserResponseDTO | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const userResponseData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
    return userResponseData;
  }

  async update(id: number, data: Users): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ${id} not found`);
    }

    Object.assign(user, data);

    await this.userRepository.save(user);

    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ${id} not found`);
    }

    await this.userRepository.delete(id);
  }
}
