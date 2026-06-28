import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('aura_token');
  if (token) req = req.clone({ setHeaders: { 'x-access-token': token } });
  return next(req);
};
