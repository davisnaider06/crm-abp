import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  app.enableCors({
    origin: (origin, callback) => {
      const frontendUrl = configService.get<string>('FRONTEND_URL');
      const allowed = [frontendUrl, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean);
      // allow non-browser requests (e.g. curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await prismaService.enableShutdownHooks(app);
  await app.listen(configService.getOrThrow<number>('PORT'));
}
bootstrap();
