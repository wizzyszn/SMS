import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StandardLoggerService } from './logger/logger.service';
import { GlobalExceptionFilter } from './common/filters/global-exception-filters';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptors/responseInterceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'], // Enable basic logging
    });
    app.enableCors();
    app.setGlobalPrefix('api/v1');
    const logger = app.get(StandardLoggerService);
    app.useLogger(logger);
    app.useGlobalFilters(new GlobalExceptionFilter(logger));
    app.useGlobalInterceptors(new ResponseInterceptor());
    const swaggerConfig = new DocumentBuilder()
      .setTitle('School Management System')
      .setDescription('')
      .setVersion('1.0')
      .addTag('Education')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/api`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

bootstrap();
