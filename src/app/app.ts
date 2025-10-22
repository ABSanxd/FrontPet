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
    
    this.actualizarVisibilidad();
    
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarVisibilidad();
      });
  }

  private actualizarVisibilidad() {
    const url = this.router.url.split('?')[0];

    const rutasConBannerTop = ['/servicios', '/donaciones'];
    const rutasConBannerLateral = ['/adopciones', '/donaciones'];

    this.mostrarBannerTop = rutasConBannerTop.includes(url);
    this.mostrarBannerLateral = rutasConBannerLateral.includes(url);
  }
}