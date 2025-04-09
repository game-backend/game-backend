import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { throwError, firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { HttpClientServiceException } from '@app/api-service/api-service-error';

@Injectable()
export class ApiService {
  constructor(
    private httpService: HttpService,
  ) {}

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return firstValueFrom(
      this.httpService
        .get(url, {
          ...config,
          timeout: 15000,
        })
        .pipe(
          catchError((e) => {
            console.error(`GET request failed for url: ${url}, code: ${e.status}, status: ${e.response?.status}`);
            return throwError(() => HttpClientServiceException.fromError(e));
          }),
        ),
    );
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return firstValueFrom(
      this.httpService
        .post(url, data, {
          ...config,
        })
        .pipe(
          catchError((e) => {
            console.error(`POST request failed for url: ${url}, code: ${e.status}, status: ${e.response?.status}`, data);
            return throwError(() => HttpClientServiceException.fromError(e));
          }),
        ),
    );
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return firstValueFrom(
      this.httpService
        .patch(url, data, {
          ...config,
        })
        .pipe(
          catchError((e) => {
            console.error(`PATCH request failed for url: ${url}, code: ${e.status}, status: ${e.response?.status}`, data);
            return throwError(() => HttpClientServiceException.fromError(e));
          }),
        ),
    );
  }
}
