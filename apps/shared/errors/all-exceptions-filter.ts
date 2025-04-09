import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status;
    let message;
    let error;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;

      if (exception?.name === 'BadRequestException') {
        error = exception.getResponse()['message'];
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    }

    const jsonResponse = {
      statusCode: status,
      path: request.url,
      message,
      error,
    };
    response.status(status).json(jsonResponse);
  }
}
