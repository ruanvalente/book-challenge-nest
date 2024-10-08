import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './controller/user.controller';
import { AuthModule } from 'src/infra/auth/auth.module';
import { UserService } from './services/user.service';
import { Users } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
