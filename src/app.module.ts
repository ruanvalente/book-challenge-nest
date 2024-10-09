import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './infra/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './infra/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { AuthorsModule } from './modules/authors/authors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BooksModule,
    AuthorsModule,
  ],
  providers: [],
})
export class AppModule {}
