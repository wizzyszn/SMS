import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StandardLoggerService } from './logger/logger.service';
import { GlobalExceptionFilter } from './common/filters/global-exception-filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(StandardLoggerService)
  app.use(logger)
  app.useGlobalFilters(new GlobalExceptionFilter(logger))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
