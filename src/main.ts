import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {env} from "prisma/config";
import {ResponseInterceptor} from "./common/interceptors/response.interceptor";
import {HttpExceptionFilter} from "./common/filters/http-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // * Enable CORS for all origins
    app.enableCors()

    // * Use global validation pipe to automatically validate incoming requests
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        })
    );

    // * Use global exception filter to handle HTTP exceptions and format error responses
    app.useGlobalFilters(new HttpExceptionFilter())

    // * Use global response interceptor to standardize API responses
    app.useGlobalInterceptors(new ResponseInterceptor())

    // * Start the server on the specified port or default to 3000
    await app.listen(env('PORT') ?? 3000);
}

bootstrap();
