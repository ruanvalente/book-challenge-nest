import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API de Livros')
    .setDescription(
      'A API de Livraria oferece um conjunto completo de endpoints que permitem a interação com um sistema de gerenciamento de livraria. Com ela, é possível consultar informações sobre livros, autores, categorias e realizar operações relacionadas a compras, estoque e clientes. A API é projetada para ser RESTful, garantindo que as operações sejam intuitivas e fáceis de integrar com aplicações frontend, mobile ou outros serviços back-end.',
    )
    .setVersion('1.0')
    .addTag('livros')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
