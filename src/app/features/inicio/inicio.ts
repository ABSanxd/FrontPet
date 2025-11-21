// src/app/features/inicio/inicio.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneAd } from '../../models/enums/zoneAd.enum';
import { PopupService } from '../../services/pop_up/popup.service';
import { AdvertisementService } from '../../services/advertisement/advertisement.service';
import { take } from 'rxjs';
import { ListarMascotas } from '../mascotas/listar-mascotas/listar-mascotas';
import { UserAchievements } from './user-achievements/user-achievements';
import { AuthService } from '../../core/services/auth/auth.service';
import { Ranking } from './ranking/ranking';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, ListarMascotas, Ranking, UserAchievements],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  protected readonly ZoneAd = ZoneAd;
  currentUserId: string = '';

  constructor(
    private popupService: PopupService,
    private advertisementService: AdvertisementService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    // Obtener el ID del usuario autenticado
    const user = this.authService.getUser();
    if (user) {
      this.currentUserId = user.id;
    }
  }

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
