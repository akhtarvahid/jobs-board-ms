import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';

export const swaggerConfig = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('TIP Medium Service')
    .setDescription('A Medium Service Provider')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name is important and must match the decorator
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const openapiDir = './openapi';
  if (!fs.existsSync(openapiDir)) {
    fs.mkdirSync(openapiDir);
  }
  fs.writeFileSync(`${openapiDir}/swagger.yaml`, yaml.dump(document));

  SwaggerModule.setup('api', app, document);
};
