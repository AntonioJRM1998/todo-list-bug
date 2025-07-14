import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Todo List API')
        .setDescription('API documentation for the Todo List project')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3000;

    await app.listen(port);

    Logger.log(`Application is running on port: ${port}`, 'Bootstrap');
    Logger.log(
        `Swagger docs available at http://localhost:${port}/api`,
        'Swagger',
    );
}
bootstrap();
