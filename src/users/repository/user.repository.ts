import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(userData: Partial<Users>): Promise<Users> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findById(id: number): Promise<Users> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Users> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  async update(id: number, userData: Partial<Users>): Promise<Users> {
    await this.userRepository.update(id, userData);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
