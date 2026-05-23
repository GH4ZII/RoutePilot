import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import type { App } from 'supertest/types';

export async function createTestApp(
  imports: Parameters<typeof Test.createTestingModule>[0]['imports'],
): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports,
  }).compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>({
    bodyParser: false,
  });
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.init();
  return app;
}
