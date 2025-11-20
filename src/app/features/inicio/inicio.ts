// src/app/features/inicio/inicio.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneAd } from '../../models/enums/zoneAd.enum';
import { PopupService } from '../../services/pop_up/popup.service';
import { AdvertisementService } from '../../services/advertisement/advertisement.service';
import { take } from 'rxjs';
import { ListarMascotas } from '../mascotas/listar-mascotas/listar-mascotas';
import { Ranking } from './ranking/ranking';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule,ListarMascotas, Ranking], 
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