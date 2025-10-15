import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
 const auth = inject(AuthService);
  const token = auth.getToken(); 

  if (!token) return next(req); // si no hay token, sigue normal

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}` // agrega el token en la cabecera
    }
  });

  return next(authReq);
};
