import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AdvertisementResponseDTO } from '../../../../models/advertisement';
import { CommonModule } from '@angular/common';
import { SocialMediaType } from '../../../../models/enums/socialMediaType.enum';

@Component({
  selector: 'app-side-banner-ad',
  imports: [CommonModule],
  templateUrl: './side-banner-ad.html',
  styleUrl: './side-banner-ad.css',
})
export class SideBannerAd   {
  @Input({ required: true }) ad!: AdvertisementResponseDTO;

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
