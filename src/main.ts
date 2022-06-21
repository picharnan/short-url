import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

const confitPort = process.env.PORT as unknown as number;

async function bootstrap() {
  ConfigModule.forRoot({
    isGlobal: true,
  });

  const servicePort = confitPort || 3003;

  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(servicePort);

  Logger.log(``);
  Logger.log(``);
  Logger.log(`#######################################################`);
  Logger.log(`## Start ShortURL on HTTP:${servicePort}`);
}
bootstrap();
