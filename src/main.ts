import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import Logging from 'library/Logging';
import * as Handlebars from 'handlebars';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: [process.env.CORS_ORIGIN],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  Handlebars.registerHelper('even', function (value: number) {
    return value % 2 === 0;
  });

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);

  Logging.info(`App is listening on ${await app.getUrl()}`);
}
bootstrap();
