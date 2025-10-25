import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneAd } from '../../models/enums/zoneAd.enum';
import { PopupService } from '../../services/pop_up/popup.service';
import { AdvertisementService } from '../publicidad/advertisement.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  protected readonly ZoneAd = ZoneAd;
  constructor(
    private popupService: PopupService,
    private advertisementService: AdvertisementService
  ) {}

  mostrarPopupDespuesDeReto() {
    this.advertisementService
      .getByZone(ZoneAd.POP_UP)
      .pipe(take(1))
      .subscribe({
        next: (popups) => {
          if (popups.length > 0) {
            this.popupService.mostrarSiguienteDeRotacion(popups);
          }
        },
      });
  }
}
