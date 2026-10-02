import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        // Normalize message into a consistent shape, whether it's:
        // - a plain string (e.g. new UnauthorizedException('Invalid credentials'))
        // - an array of strings (ValidationPipe's default output)
        // - not an HttpException at all (unexpected errors)
        let message: string | string[];

        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        } else if (
            exceptionResponse &&
            typeof exceptionResponse === 'object' &&
            'message' in exceptionResponse
        ) {
            message = (exceptionResponse as any).message; // string or string[], from ValidationPipe or manual throws
        } else {
            message = 'Internal server error';
        }

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
        });
    }
}
