import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true })

  const serverConfig = config.get('server');
  const port = serverConfig.port;

  // swagger
  const swagger = new DocumentBuilder()
    .setTitle('Bank Swagger')
    .setDescription('HeyU 은행 프로젝트 백엔드 문서')
    .setVersion('1.0.0')
    .addTag('auth')
    .addTag('banks')
    .build()
  
  const document = SwaggerModule.createDocument(app, swagger)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(port);
  Logger.log(`Application running on port ${port}`)


}
bootstrap();
