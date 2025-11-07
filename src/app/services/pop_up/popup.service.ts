import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
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
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  mostrarSiguienteDeRotacion(popups: AdvertisementResponseDTO[], forzar: boolean = false) {
    if (popups.length === 0 || !this.isBrowser) return;

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
    if (!this.isBrowser) return -1;
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? parseInt(stored, 10) : -1;
  }

  private guardarIndice(indice: number): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.STORAGE_KEY, indice.toString());
  }

  resetearRotacion(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}