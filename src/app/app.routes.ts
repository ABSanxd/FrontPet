import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Inicio } from './features/inicio/inicio';
import { authGuard } from './core/guards/auth.guard';
import { Adopciones } from './features/adopciones/adopciones';
import { CrearPublicacion } from './features/adopciones/crear/crear-publicacion';

import { Donaciones } from './features/donaciones/donaciones';
import { Perfil } from './features/perfil/perfil';
import { guestGuard } from './core/guards/guest.guard';
import { Servicios } from './features/publicidad/servicios';
import { RegistrarMascota } from './features/mascotas/registrar-mascota/registrar-mascota';
import { DetallesMascota } from './features/mascotas/detalles-mascota/detalles-mascota';
import { ResetPassword } from './features/auth/components/reset-password/reset-password';
import { RegistrarVacuna } from './features/mascotas/registrar-vacuna/registrar-vacuna';
import { DetallePublicacion } from './features/adopciones/detalle/detalle-publicacion';
import { Notificaciones } from './features/notificaciones/notificaciones';


export const routes: Routes = [
  { path: '', component: Landing, canActivate: [guestGuard] },
  {
    path: 'inicio',
    component: Inicio,
    canActivate: [authGuard]
  },
  {
    path: 'adopciones',
    component: Adopciones,
    canActivate: [authGuard]
  },
  {
    path: 'publicaciones/crear',
    component: CrearPublicacion,
    canActivate: [authGuard]
  },
  {
    path: 'publicaciones/editar/:id',
    component: CrearPublicacion,
    canActivate: [authGuard]
  },

  {
    path: 'publicaciones/:id/detalle',
    component: DetallePublicacion, 
    canActivate: [authGuard]
  },

  {
    path: 'servicios',
    component: Servicios,
    canActivate: [authGuard]
  },
  {
    path: 'donaciones',
    component: Donaciones,
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard]
  },
  {
    path: 'notificaciones',
    component: Notificaciones, // lo crearemos ahora
    canActivate: [authGuard]
  },

  {
    path: 'mascotas/nueva',
    component: RegistrarMascota,
    canActivate: [authGuard]
  },
  {
    path: 'mascotas/:id',
    component: DetallesMascota,
    canActivate: [authGuard]
  },
  {
    path: 'mascotas/:id/editar',
    component: RegistrarMascota,
    canActivate: [authGuard]
  },

  {
    path: 'mascotas/:id/editar',
    component: RegistrarMascota,
    canActivate: [authGuard]
  },

  {
    path: 'reset-password',
    component: ResetPassword,
    canActivate: [guestGuard] // Solo usuarios no logueados
  },
  {
    path: 'mascotas/:petId/vacunas/nueva',
    component: RegistrarVacuna,
    canActivate: [authGuard]
  },
  {
    path: 'mascotas/:petId/vacunas/:vaccineId/editar',
    component: RegistrarVacuna,
    canActivate: [authGuard]
  },


  { path: '**', redirectTo: '' }

];