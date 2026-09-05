import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {map, Observable} from 'rxjs';

export interface Response<T> {
    success: boolean;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((result) => {
                if (this.isPaginated(result)) {
                    const {data, meta} = result;
                    return {
                        success: true,
                        data,
                        meta,
                    };
                }

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
