import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Author } from 'src/entities/author';
import { Book } from 'src/entities/book';
import { Order } from 'src/entities/order';
import { OrderedItem } from 'src/entities/ordered-item';
import { Users } from 'src/entities/users';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Users, Order, OrderedItem, Book, Author],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
// eslint-disable-next-line prettier/prettier
export class DatabaseModule { }
