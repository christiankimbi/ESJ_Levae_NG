import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { baseUrlInterceptor } from '@core/base-url.interceptor';
import { authInterceptor } from '@core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      baseUrlInterceptor,
      authInterceptor
    ]))
  ]
};
