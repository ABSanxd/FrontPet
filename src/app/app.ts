import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { AdZone } from './features/publicidad/components/ad-zone/ad-zone';
import { ZoneAd } from './models/enums/zoneAd.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CommonModule, AdZone],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('front-pet');

  protected readonly ZoneAd = ZoneAd;

  mostrarBannerTop = false;
  mostrarBannerLateral = false;

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.actualizarVisibilidad();
    }); // Ejecutar en la primera carga
    this.actualizarVisibilidad();
  }

  private actualizarVisibilidad() {
    const url = this.router.url.split('?')[0]; 

    const rutasConBannerTop = [
      '/', 
      '/adopciones', 
      '/servicios',
      
      
    ];

    const rutasConBannerLateral = ['/adopciones', '/donaciones', '/servicios'];

    // El Top Banner  se muestra si la URL está en la lista de rutasConBannerTop.
    this.mostrarBannerTop = rutasConBannerTop.includes(url);

    this.mostrarBannerLateral = rutasConBannerLateral.includes(url);
  }
}
