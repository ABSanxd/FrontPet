import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdvertisementResponseDTO } from '../../models/advertisement';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  //BehaviorSubject para mantener estado actual del pop-up
  private mostrarPopup$ = new BehaviorSubject<AdvertisementResponseDTO | null>(null);
  //Los componentes se suscriben aquí para saber qué mostrar
  popup$: Observable<AdvertisementResponseDTO | null> = this.mostrarPopup$.asObservable();

  private readonly STORAGE_KEY = 'ultimo_popup_index';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  mostrarSiguienteDeRotacion(popups: AdvertisementResponseDTO[], forzar: boolean = false) {
    if (popups.length === 0) return;

    // Obtener el último índice mostrado
    const ultimoIndice = this.obtenerUltimoIndice();
    // Calcular el siguiente índice (rotación circular)
    const siguienteIndice = (ultimoIndice + 1) % popups.length;
    // Obtener el pop-up a mostrar
    const popupAMostrar = popups[siguienteIndice];
    // Guardar el índice actual
    this.guardarIndice(siguienteIndice);
    // Mostrar el pop-up
    this.mostrarPopup$.next(popupAMostrar);
  }

  cerrar() {
    this.mostrarPopup$.next(null);
  }
  private obtenerUltimoIndice(): number {
    
    if(isPlatformBrowser(this)){
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? parseInt(stored, 10) : -1;

    }
    return -1;  
    
  }
  private guardarIndice(indice: number): void {

    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem(this.STORAGE_KEY, indice.toString());

    }
  }

  // Método para resetear
  resetearRotacion(): void {

    if(isPlatformBrowser(this.platformId)){
      localStorage.removeItem(this.STORAGE_KEY);

    }
  }
}