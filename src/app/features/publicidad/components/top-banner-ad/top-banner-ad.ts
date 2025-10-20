import { Component, Input } from '@angular/core';
import { AdvertisementResponseDTO } from '../../../../models/advertisement';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-banner-ad',
  imports: [CommonModule],
  templateUrl: './top-banner-ad.html',
  styleUrl: './top-banner-ad.css',
})
export class TopBannerAd {
  @Input({ required: true }) ad!: AdvertisementResponseDTO;

  abrirLink(url: string) {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  onImageError(event: any, banner: AdvertisementResponseDTO) {
    console.error('Error al cargar imagen:', banner.imageUrl);
    banner.imageUrl = '';
  }

  getSocialIcon(type: string): string {
    const icons: any = {
      FACEBOOK: 'bi bi-facebook',
      INSTAGRAM: 'bi bi-instagram',
      TIKTOK: 'bi bi-tiktok',
      TWITTER: 'bi bi-twitter-x',
      LINKEDIN: 'bi bi-linkedin',
      WHATSAPP: 'bi bi-whatsapp',
    };
    return icons[type] || 'bi bi-link-45deg';
  }

  getSocialName(type: string): string {
    const names: any = {
      FACEBOOK: 'Facebook',
      INSTAGRAM: 'Instagram',
      TIKTOK: 'TikTok',
      TWITTER: 'Twitter',
      LINKEDIN: 'LinkedIn',
      WHATSAPP: 'WhatsApp',
    };
    return names[type] || 'Red Social';
  }
}
