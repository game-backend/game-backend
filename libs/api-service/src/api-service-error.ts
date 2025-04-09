import { HttpException } from '@nestjs/common';

export class HttpClientServiceException extends HttpException {
  constructor(message: string, status: number) {
    super(message, status);
  }

  static fromError(error: any): HttpClientServiceException {
    return error.response
      ? new HttpClientServiceException(error.response.statusText, error.response.status)
      : new HttpClientServiceException('No response from server', 503);
  }
}
