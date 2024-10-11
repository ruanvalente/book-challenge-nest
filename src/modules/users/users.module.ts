import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/infra/auth/auth.module';

import { UserController } from './controller/user.controller';
import { Users } from './entities/users.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
