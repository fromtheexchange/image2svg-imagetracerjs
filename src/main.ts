import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { useGlobal } from './useGlobal';

async function start() {
  const app = await NestFactory.create(AppModule);
  await useGlobal(app);
  await app.listen(4002);
}
start();
