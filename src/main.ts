import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { appConfig } from '@config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


setImmediate(async(): Promise<void> => {
  const app = await NestFactory.create(AppModule); 

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const options = new DocumentBuilder()
    .setTitle('Iqro API')
    .setDescription('The Iqro API description')
    .setVersion('1.0')
    .addServer('http://localhost:8080/', 'Local environment')
    .addTag('tasks', 'Tasks operations')
    .build();

const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(appConfig.port, appConfig.host);
});
