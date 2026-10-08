export interface IApiResponse {
  success: boolean;
  message?: string;
  data?: Record<string, any> | null;
}

export function buildResponse(
  success: boolean,
  message?: string,
  data?: Record<string, any> | null,
): IApiResponse {
  return {
    success,
    message,
    data,
  };
}