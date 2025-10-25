import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AdvertisementResponseDTO } from '../../../../models/advertisement';
import { AdvertisementService } from '../../advertisement.service';
import { CommonModule } from '@angular/common';
import { ZoneAd } from '../../../../models/enums/zoneAd.enum';
import { TopBannerAd } from '../top-banner-ad/top-banner-ad';
import { SideBannerAd } from '../side-banner-ad/side-banner-ad';
import { FooterAd } from '../footer-ad/footer-ad';

@Component({
  selector: 'app-ad-zone',
  imports: [CommonModule, TopBannerAd, SideBannerAd, FooterAd],
  templateUrl: './ad-zone.html',
  styleUrl: './ad-zone.css',
})
export class AdZone implements OnInit, OnDestroy {
  @Input({ required: true }) zone!: ZoneAd;
  @Input() rotationInterval: number = 7000; // 7 segundos para el carrusel
  protected readonly ZoneAd = ZoneAd;

  ads: AdvertisementResponseDTO[] = [];
  currentAd: AdvertisementResponseDTO | null = null;
  currentIndex: number = 0;
  intervalHandler: any;
  isLoading = true;
  errorCarga = false;

  constructor(private advertisementService: AdvertisementService) {}

  ngOnInit() {
    this.cargarPublicidad();
  }

  ngOnDestroy() {
    if (this.intervalHandler) {
      clearInterval(this.intervalHandler);
    }
  }

  // AdZone.ts: Revisa la lógica de error y carga
  cargarPublicidad() {
    this.advertisementService.getByZone(this.zone).subscribe({
      next: (ads) => {
        this.ads = ads;
        this.isLoading = false; 

        if (this.ads.length > 0) {
          this.currentAd = this.ads[0];
          this.iniciarRotacion();
        }
      },
      error: (error) => {
        console.error(`Error al cargar publicidad en ${this.zone}:`, error);
        this.errorCarga = true;
        this.isLoading = false; 
      },
    });
  }

  iniciarRotacion() {
    
    if (this.ads.length > 1) {
      this.intervalHandler = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.ads.length;
        this.currentAd = this.ads[this.currentIndex];
      }, this.rotationInterval);
    }
  }
}
