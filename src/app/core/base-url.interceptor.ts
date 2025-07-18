import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api')) {
    const updatedReq = req.clone({
      url: `${environment.apiBaseUrl}${req.url}`
    });
    return next(updatedReq);
  }

  return next(req);
};
