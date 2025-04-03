import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Scraper API')
      .setDescription('API para scraping de acompanhamento de obra')
      .setVersion('1.0')
      .addTag('scraper')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // Rota: http://localhost:3000/api
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
