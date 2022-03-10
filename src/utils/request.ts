/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRequestConfig extends AxiosRequestConfig {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IResponse<T = any> = AxiosResponse;

export class Request {
  constructor(private request = axios) {}

  public get<T>(
    url: string,
    config: IRequestConfig = {}
  ): Promise<IResponse<T>> {
    return this.request.get<T, IResponse<T>>(url, config);
  }

  public static isRequestError(error: Error): boolean {
    return !!(
      (error as AxiosError).response && (error as AxiosError).response?.status
    );
  }

  public static extractErrorData(
    error: unknown
  ): Pick<AxiosResponse, 'data' | 'status'> {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status) {
      return {
        data: axiosError.response.data,
        status: axiosError.response.status,
      };
    }
    throw Error(`The error ${error} is not a Request Error`);
  }
}
