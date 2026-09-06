import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as z from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodSchema) {}
   
  /**
   * Transforms and validates the input value using the provided Zod schem.
   * @param value - The value to validate
   * @returns The validated and potentially transformed value
   * @throws BadRequestException if validation fails
   */
  transform(value: unknown): unknown {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = this.formatZodErrors(error.issues);

        throw new BadRequestException({
          message: 'Validation failed',
          error: 'Bad Request',
          statusCode: 400,
          errors: formattedErrors,
        });
      }

      // Handle unexpected errors
      throw new BadRequestException({
        message: 'Validation failed due to an unexpected error',
        error: 'Bad Request',
        statusCode: 400,
      });
    }
  }

  /**
   * Formats Zod validation issues into a more readable format.
   * @param issues - Array of Zod validation issues
   * @returns Array of formatted error objects
   */
  private formatZodErrors(issues: z.ZodIssue[]) {
    return issues.map((issue) => ({
      field: issue.path.length > 0 ? issue.path.join('.') : 'root',
      message: issue.message,
      code: issue.code,
      received: 'received' in issue ? issue.received : undefined,
      expected: 'expected' in issue ? issue.expected : undefined,
    }));
  }
}
