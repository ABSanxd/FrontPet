import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdvertisementResponseDTO } from '../../models/advertisement';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private mostrarPopup$ = new BehaviorSubject<AdvertisementResponseDTO | null>(null);
  popup$: Observable<AdvertisementResponseDTO | null> = this.mostrarPopup$.asObservable();

  private readonly STORAGE_KEY = 'ultimo_popup_index';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  mostrarSiguienteDeRotacion(popups: AdvertisementResponseDTO[], forzar: boolean = false) {
    if (popups.length === 0) return;

    const ultimoIndice = this.obtenerUltimoIndice();
    const siguienteIndice = (ultimoIndice + 1) % popups.length;
    const popupAMostrar = popups[siguienteIndice];

    this.guardarIndice(siguienteIndice);
    this.mostrarPopup$.next(popupAMostrar);
  }

  cerrar() {
    this.mostrarPopup$.next(null);
  }

  private obtenerUltimoIndice(): number {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? parseInt(stored, 10) : -1;
    }
    return -1; // valor por defecto si se ejecuta fuera del navegador
  }

  private guardarIndice(indice: number): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, indice.toString());
    }
  }

  resetearRotacion(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}