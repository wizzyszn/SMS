import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StandardLoggerService } from './logger/logger.service';
import { GlobalExceptionFilter } from './common/filters/global-exception-filters';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // Disable Nest's default logger
  });
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const logger = app.get(StandardLoggerService);
  app.useLogger(logger);
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('School Management System')
    .setDescription('')
    .setVersion('1.0')
    .addTag('Education')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
