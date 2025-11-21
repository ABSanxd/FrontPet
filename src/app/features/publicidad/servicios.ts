import { Component, OnInit } from '@angular/core';
import { AdvertisementService } from '../../services/advertisement/advertisement.service';
import { ZoneAd } from '../../models/enums/zoneAd.enum';
import { AdvertisementResponseDTO } from '../../models/advertisement';
import { ServiceAdCard } from './components/service-ad-card/service-ad-card';

@Component({
  selector: 'app-servicios',
  imports: [ServiceAdCard],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios implements OnInit {
  constructor(private advertisementService: AdvertisementService) {}
  serviceAds: AdvertisementResponseDTO[] = [];
  isLoading: boolean = true;
  hasError: boolean = false;
  private readonly ZONE = ZoneAd.SERVICES;
  ngOnInit(): void {
    this.loadServiceAds();
  }

  loadServiceAds(): void {
    this.isLoading = true;
    this.hasError = false;

    // Llamada al servicio para obtener anuncios de tipo SERVICE_LIST
    this.advertisementService.getByZone(this.ZONE).subscribe({
      next: (ads) => {
        // Asigna los anuncios y finaliza la carga
        this.serviceAds = ads;
        this.isLoading = false;
      },
      error: (err) => {
        // Muestra un error en consola y actualiza el estado
        console.error('Error al cargar la lista de servicios:', err);
        this.hasError = true;
        this.isLoading = false;
        // limpiar la lista en caso de error
        this.serviceAds = [];
      },
    });
  }
}
