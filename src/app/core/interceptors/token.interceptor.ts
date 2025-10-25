import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (!token) return next(req); // si no hay token, sigue normal

  try {
    // Decodificar el token JWT para obtener el userId
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Extraer el userId del payload (ajusta según la estructura de tu JWT)
    // Puede ser: sub, userId, id, user_id, etc.
    const userId = payload.sub || payload.userId || payload.id || payload.user_id;
    
    console.log('Token interceptor - userId extraído:', userId);
    
    // Clonar la petición y agregar AMBOS headers
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-User-Id': userId || ''
      }
    });

    return next(authReq);
  } catch (error) {
    console.error('Error al decodificar token en interceptor:', error);
    
    // Si hay error, al menos envía el token de autorización
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(authReq);
  }
};