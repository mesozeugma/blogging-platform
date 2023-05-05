import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (!(error instanceof HttpErrorResponse)) {
          return throwError(() => error);
        }
        if (error.status === 401) {
          this.userService.clearUser();
          this.router.navigate(['/login']);
        } else if (error.status === 404) {
          this.router.navigate(['/error', '404']);
        } else {
          return throwError(() => error);
        }
        return EMPTY;
      })
    );
  }
}
