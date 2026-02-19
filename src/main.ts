import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable global validation pipe with strict validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Setup Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('YouApp API')
    .setDescription(
      'Professional backend API for YouApp - Authentication, User Profiles, and Real-time Chat with MongoDB and RabbitMQ',
    )
    .setVersion('1.0.0')
    .setContact(
      'YouApp Team',
      'https://youapp.com',
      'support@youapp.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Token obtained from /api/login endpoint',
      },
      'JWT',
    )
    .addTag('Authentication', 'User registration and login endpoints')
    .addTag('Profile', 'User profile management with zodiac/horoscope')
    .addTag('Chat', 'Real-time messaging between users with RabbitMQ')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`✅ Server running on http://localhost:${port}`);
  logger.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start application:', err);
  process.exit(1);
});
