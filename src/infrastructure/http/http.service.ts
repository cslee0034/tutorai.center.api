import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HTTPService {
  constructor(private readonly httpService: HttpService) {}

  private readonly getErrorMessage = (e: any) => {
    return (
      e.message ||
      e.response?.data ||
      e.response?.data?.message ||
      'Internal server error'
    );
  };

  private readonly getErrorStatus = (e: any) => {
    return e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
  };

  get<T>(url: string, params?: any): Observable<AxiosResponse<T>> {
    return this.httpService.get<T>(url, { params }).pipe(
      catchError((e) => {
        throw new HttpException(
          this.getErrorMessage(e),
          this.getErrorStatus(e),
        );
      }),
    );
  }

  post<T>(url: string, data?: any, config?: any): Observable<AxiosResponse<T>> {
    return this.httpService.post<T>(url, data, config).pipe(
      catchError((e) => {
        throw new HttpException(
          this.getErrorMessage(e),
          this.getErrorStatus(e),
        );
      }),
    );
  }

  patch<T>(
    url: string,
    data?: any,
    config?: any,
  ): Observable<AxiosResponse<T>> {
    return this.httpService.patch<T>(url, data, config).pipe(
      catchError((e) => {
        throw new HttpException(
          this.getErrorMessage(e),
          this.getErrorStatus(e),
        );
      }),
    );
  }

  put<T>(url: string, data?: any, config?: any): Observable<AxiosResponse<T>> {
    return this.httpService.put<T>(url, data, config).pipe(
      catchError((e) => {
        throw new HttpException(
          this.getErrorMessage(e),
          this.getErrorStatus(e),
        );
      }),
    );
  }

  delete<T>(url: string, config?: any): Observable<AxiosResponse<T>> {
    return this.httpService.delete<T>(url, config).pipe(
      catchError((e) => {
        throw new HttpException(
          this.getErrorMessage(e),
          this.getErrorStatus(e),
        );
      }),
    );
  }
}
