if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';
import { GlobalValidationPipe } from './shared/pipes/global-validation.pipe';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '0.0.0.0'; // Always use 0.0.0.0 for Docker

  swaggerConfig(app);
  
  await app.listen(port, host);
  
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📄 Swagger: http://0.0.0.0:${port}/api`);
}
bootstrap();
