import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { CommonModule } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { AdZone } from './features/publicidad/components/ad-zone/ad-zone';
import { ZoneAd } from './models/enums/zoneAd.enum';
import { PopUp } from './features/publicidad/components/pop-up/pop-up';
import { PopupService } from './services/pop_up/popup.service';
import { AdvertisementResponseDTO } from './models/advertisement';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CommonModule, AdZone, PopUp],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('front-pet');
  protected readonly ZoneAd = ZoneAd;

  mostrarBannerTop = false;
  mostrarBannerLateral = false;
  mostrarBannerFooter = false;

  popupActual$!: Observable<AdvertisementResponseDTO | null>;

  constructor(private router: Router, private popupService: PopupService) {
    this.popupActual$ = this.popupService.popup$;

    this.actualizarVisibilidad();

    // Escuchar s de ruta
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.actualizarVisibilidad();
    });
  }

  private actualizarVisibilidad() {
    const url = this.router.url.split('?')[0];

    const rutasConBannerTop = ['/donaciones'];
    const rutasConBannerLateral = ['/adopciones', '/donaciones'];
    const rutasConBannerFooter = ['/inicio', '/donaciones'];

    this.mostrarBannerTop = rutasConBannerTop.includes(url);
    this.mostrarBannerLateral = rutasConBannerLateral.includes(url);
    this.mostrarBannerFooter = rutasConBannerFooter.includes(url);
  }

  cerrarPopup() {
    this.popupService.cerrar();
  }
}
