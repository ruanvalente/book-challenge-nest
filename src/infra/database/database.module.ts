import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Author } from 'src/modules/authors/entities/author.entity';
import { Book } from 'src/modules/books/entities/book.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderedItem } from 'src/modules/orders/entities/ordered-item.entity';
import { Users } from 'src/modules/users/entities/users.entity';
import { SeedService } from './services/seed.service';

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
    TypeOrmModule.forFeature([Author, Book, Order, OrderedItem, Users]),
  ],
  exports: [TypeOrmModule, SeedService],
  providers: [SeedService],
})
export class DatabaseModule {}
