import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const seedService = app.get(SeedService);
  await seedService.run();

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 SORIA backend running on port ${port}`);
}
bootstrap();