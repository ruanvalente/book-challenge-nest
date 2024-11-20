import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { UserResponseDTO } from '../entities/dto/response/user.response.dto';
import { Users } from '../entities/users.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(data: Users): Promise<Users> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      data.password = hashedPassword;

      const user = await this.userRepository.save(data);
      return user;
    } catch (error) {
      this.logger.error('Erro ao criar usuário', error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o usuário. Tente novamente mais tarde.',
      );
    }
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
    try {
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
    } catch (error) {
      this.logger.error('Erro ao buscar usuários', error.stack);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar os usuários. Tente novamente mais tarde.',
      );
    }
  }

  async findByEmail(email: string): Promise<UserResponseDTO | undefined> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      this.logger.error(
        `Erro ao buscar usuário por e-mail: ${email}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar o usuário. Tente novamente mais tarde.',
      );
    }
  }

  async findOne(id: number): Promise<UserResponseDTO> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }

      const userResponseData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };
      return userResponseData;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar o usuário. Tente novamente mais tarde.',
      );
    }
  }

  async update(id: number, data: Users): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }

      Object.assign(user, data);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.logger.error(`Erro ao atualizar usuário com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar o usuário. Tente novamente mais tarde.',
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }

      await this.userRepository.delete(id);
    } catch (error) {
      this.logger.error(`Erro ao deletar usuário com ID ${id}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao deletar o usuário. Tente novamente mais tarde.',
      );
    }
  }
}
