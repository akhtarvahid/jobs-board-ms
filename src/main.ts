if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';
import { GlobalValidationPipe } from './shared/pipes/global-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new GlobalValidationPipe());
 // Enable CORS for local development
  app.enableCors({
    origin: 'http://localhost:5173', // Your React app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  swaggerConfig(app);
  console.log(`App running on port: 3000`);
  console.log(`Swagger is live - http://localhost:3000/api#/`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
