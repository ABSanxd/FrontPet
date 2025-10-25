import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdvertisementResponseDTO } from '../../../../models/advertisement';
import { SocialMediaType } from '../../../../models/enums/socialMediaType.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-ad',
  imports: [CommonModule],
  templateUrl: './footer-ad.html',
  styleUrl: './footer-ad.css',
})
export class FooterAd {
  @Input({ required: true }) ad!: AdvertisementResponseDTO;
  @Output() closed = new EventEmitter<void>();

  mostrarBanner = true;
  cerrando = false;

  cerrarBanner() {
    this.cerrando = true;
    setTimeout(() => {
      this.mostrarBanner = false;
      this.closed.emit(); // Notificar al padre que se cerró
    }, 300);
  }
  abrirLink(url: string) {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  onImageError(event: any) {
    console.error('Error al cargar imagen:', this.ad.imageUrl);
    this.ad.imageUrl = '';
  }

  getSocialIcon(type: SocialMediaType): string {
    const icons: Record<SocialMediaType, string> = {
      [SocialMediaType.FACEBOOK]: 'bi bi-facebook',
      [SocialMediaType.INSTAGRAM]: 'bi bi-instagram',
      [SocialMediaType.TIKTOK]: 'bi bi-tiktok',
      [SocialMediaType.TWITTER]: 'bi bi-twitter-x',
      [SocialMediaType.LINKEDIN]: 'bi bi-linkedin',
      [SocialMediaType.WHATSAPP]: 'bi bi-whatsapp',
    };
    return icons[type] || 'bi bi-link-45deg';
  }

  getSocialName(type: SocialMediaType): string {
    const names: Record<SocialMediaType, string> = {
      [SocialMediaType.FACEBOOK]: 'Facebook',
      [SocialMediaType.INSTAGRAM]: 'Instagram',
      [SocialMediaType.TIKTOK]: 'TikTok',
      [SocialMediaType.TWITTER]: 'Twitter',
      [SocialMediaType.LINKEDIN]: 'LinkedIn',
      [SocialMediaType.WHATSAPP]: 'WhatsApp',
    };
    return names[type] || 'Red Social';
  }
}
