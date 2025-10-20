import { Component, Input } from '@angular/core';
import { AdvertisementResponseDTO } from '../../../../models/advertisement';

@Component({
  selector: 'app-service-ad-card',
  imports: [],
  templateUrl: './service-ad-card.html',
  styleUrl: './service-ad-card.css'
})
export class ServiceAdCard {
@Input({ required: true }) ad!: AdvertisementResponseDTO;

  // Lógica para mostrar el nombre de la red social
  getSocialName(type: string): string {
    const names: any = {
      FACEBOOK: 'Ver en Facebook',
      INSTAGRAM: 'Ver en Instagram',
      
    };
    return names[type] || 'Ver Red Social';
  }

  
  onImageError(event: any) {
    
    console.error('Error al cargar imagen del servicio:', this.ad.imageUrl);
  }
}
