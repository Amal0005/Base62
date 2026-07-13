import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './appModule';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );


  await app.listen(process.env.PORT ?? 3000);
}


bootstrap();