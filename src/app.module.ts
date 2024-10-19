import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './infra/auth/auth.module';
import { DatabaseModule } from './infra/database/database.module';
import { SeedService } from './infra/database/services/seed.service';
import { AuthorsModule } from './modules/authors/authors.module';
import { BooksModule } from './modules/books/books.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DatabaseModule,
    AuthModule,
    BooksModule,
    AuthorsModule,
    OrdersModule,
    UsersModule,
  ],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}
  async onModuleInit() {
    if (process.env.NODE_ENV !== 'production') await this.seedService.run();
  }
}
