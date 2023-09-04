import { HttpClient } from '@angular/common/http';
import { inject, signal } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { EMPTY, catchError, delay, of, tap, throwError } from 'rxjs';
import { SignUpForm, Status } from '../sign-up.model';

export class SignUpService {
  private httpClient = inject(HttpClient);

  status = signal<Status>('pending');

  register(formValues: ɵFormGroupValue<SignUpForm>) {
    this.status.set('loading');
    return this.httpClient
      .post('https://demo-api.now.sh/users', formValues)
      .pipe(
        delay(2000),
        tap({
          next: () => this.status.set('success'),
        }),
        catchError(() => {
          this.status.set('error');
          return of(EMPTY);
        })
      );
  }
}
