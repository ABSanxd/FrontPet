import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Inicio } from './features/inicio/inicio';
import { authGuard } from './core/guards/auth.guard';
import { Adopciones } from './features/adopciones/adopciones';
import { CrearPublicacion } from './features/adopciones/crear/crear-publicacion';
import { EditarPublicacion } from './features/adopciones/editar/editar-publicacion';

import { Donaciones } from './features/donaciones/donaciones';
import { Perfil } from './features/perfil/perfil';
import { guestGuard } from './core/guards/guest.guard';
import { Servicios } from './features/publicidad/servicios';


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
        component: EditarPublicacion,
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
    
    { path: '**', redirectTo: '' }

];
