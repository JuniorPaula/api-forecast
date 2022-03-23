import httpStatusCodes from 'http-status-codes';

export interface IApiError {
  message: string;
  code: number;
  codeAsString?: string;
  description?: string;
  documentation?: string;
}

export interface IApiErrorResponse extends Omit<IApiError, 'codeAsString'> {
  error: string;
}

export default class APIError {
  public static format(error: IApiError): IApiErrorResponse {
    return {
      ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString
          ? error.codeAsString
          : httpStatusCodes.getStatusText(error.code),
      },
      ...(error.documentation && { documentation: error.documentation }),
      ...(error.description && { description: error.description }),
    };
  }
}
