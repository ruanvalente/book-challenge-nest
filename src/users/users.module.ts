import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Users } from 'src/entities/users.entity';
import { UserRepository } from './repository/user.repository';
import { UserService } from './services/user.service';
import { RolesGuard } from 'src/infra/auth/guard/roles/roles.guard';
import { UserController } from './controller/user.controller';
import { AuthService } from 'src/infra/auth/services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), JwtModule],
  providers: [UserRepository, UserService, RolesGuard, AuthService],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
