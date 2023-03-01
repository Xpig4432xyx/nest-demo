import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); //获取请求上下文
    const response = ctx.getResponse(); //获取响应对象
    const status = exception.getStatus(); //获取状态码
    const exceptionResponse = exception.getResponse(); //获取错误信息
    let validMessage = '';

    for (const key in exception) {
      console.log(key, '<<<<key');
    }

    if (typeof exceptionResponse === 'object') {
      validMessage =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        typeof exceptionResponse.message === 'string'
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            exceptionResponse.message[0]
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            exceptionResponse.message;
    }
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    const errorResponse = {
      data: {},
      message: validMessage || message,
      code: -1,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
