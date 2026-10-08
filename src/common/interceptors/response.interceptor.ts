import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {map} from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            map((result) => {

                // Handle paginated responses by checking if the result has "data" and "meta" properties
                if (this.isPaginated(result)) {
                    const {data, meta} = result;
                    return {
                        success: true,
                        data,
                        meta,
                    };
                }

                // Handle cases where the result is already in the desired format
                if ("success" in result && "message" in result && "data" in result) {
                    return result
                }

                // For cases where the result is a single object with a "message" property
                if (Object.keys(result).length === 1 && "message" in result) {
                    return {
                        success: true,
                        message: result.message,
                    };
                }

                // Return a generic success response for other cases
                return {
                    success: true,
                    data: result,
                };
            }),
        )
    }


    private isPaginated(result: any): result is { data: unknown; meta: unknown } {
        return (
            result !== null &&
            typeof result === 'object' &&
            Array.isArray(result.data) &&
            result.meta !== undefined
        );
    }
}
