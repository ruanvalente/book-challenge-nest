import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { RolesGuard } from './guard/roles/roles.guard';

import { AuthService } from './services/auth.service';
import { UserService } from 'src/modules/users/services/user.service';

import { Users } from 'src/modules/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, UserService, RolesGuard],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
