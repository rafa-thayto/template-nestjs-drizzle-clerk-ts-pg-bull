import './instrument';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './core/filters/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

const allowlist = ['https://example.com'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowlist.includes(origin) ||
        process.env.APP_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('ChangeName API')
    .setDescription('description')
    .setVersion('1.0')
    .addTag('changename')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
      // theme: 'alternate',
      // favicon: 'https://example.com/favicon-dev.ico',
      metaData: {
        title: 'API Reference | ChangeName',
        description: 'API Reference for ChangeName',
        ogDescription: 'API Reference for ChangeName',
        ogTitle: 'API Reference | ChangeName',
        // ogImage: 'https://example.com/image.png',
        twitterCard: 'summary_large_image',
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
