import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { version } from '../package.json';

export const setupSwagger = (app: INestApplication): void => {
  const swaggerDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Superhero Database')
      .setDescription('Superhero Database API')
      .setVersion(version)
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .build(),
  );
  const options: SwaggerCustomOptions = {
    explorer: false,
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 5,
      deepLinking: true,
      displayOperationId: true,
      displayRequestDuration: true,
      validatorUrl: 'none',
    },
    customSiteTitle: 'Superhero Database API',
  };
  SwaggerModule.setup('docs', app, swaggerDocument, options);
};
