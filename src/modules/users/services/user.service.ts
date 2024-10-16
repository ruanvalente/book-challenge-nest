import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    currentPage: number = 1,
  ): Promise<{
    data: Users[];
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

    return { data, total, currentPage, totalPages };
  }

  async findByEmail(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
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
