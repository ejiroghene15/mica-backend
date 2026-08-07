import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {env} from "prisma/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // * Use global validation pipe to automatically validate incoming requests
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    // * Enable CORS for all origins
    app.enableCors()

    // * Start the server on the specified port or default to 3000
    await app.listen(env('PORT') ?? 3000);
}

bootstrap();
