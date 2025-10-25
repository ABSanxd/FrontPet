import { Component, OnInit } from '@angular/core';
import { Carousel } from './components/carousel/carousel';
import { Cards } from './components/cards/cards';
import { PopupService } from '../../services/pop_up/popup.service';
import { AdvertisementService } from '../publicidad/advertisement.service';
import { ZoneAd } from '../../models/enums/zoneAd.enum';
import { take } from 'rxjs';

@Component({
  selector: 'app-landing',
  imports: [Carousel, Cards],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  protected readonly ZoneAd = ZoneAd;
  constructor(
    private popupService: PopupService,
    private advertisementService: AdvertisementService
  ) {}
  ngOnInit(): void {
    this.advertisementService
      .getByZone(this.ZoneAd.POP_UP)
      .pipe(take(1))
      .subscribe({
        next: (popups) => {
          if (popups.length > 0) {            
            setTimeout(() => {              
              this.popupService.mostrarSiguienteDeRotacion(popups);
            }, 800);
          } else {
            console.log('No hay publicidad disponible para la zona POP_UP.');
          }
        },
        error: (err) => {
          console.error('Error al cargar la publicidad para el pop-up:', err);
        },
      });
  }
    ngOnDestroy(): void {
    //al salir de la lading se cierra solo para que no siga apareciendo si no se le marcó al X
    this.popupService.cerrar();
  }
}
