import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdvertisementResponseDTO } from '../../../../models/advertisement';
import { SocialMediaType } from '../../../../models/enums/socialMediaType.enum';

@Component({
  selector: 'app-pop-up',
  imports: [],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.css',
})
export class PopUp {
  @Input() publicidad!: AdvertisementResponseDTO;
  @Input() indice: { actual: number; total: number } | null = null;
  @Output() cerrar = new EventEmitter<void>();
  cerrarPopup() {
    this.cerrar.emit();
  }
  getSocialMediaIcon(type: SocialMediaType): string {
    switch (type) {
      case SocialMediaType.FACEBOOK:
        return 'facebook';
      case SocialMediaType.INSTAGRAM:
        return 'instagram';
      case SocialMediaType.WHATSAPP:
        return 'whatsapp';
      case SocialMediaType.TIKTOK:
        return 'tiktok';
      default:
        return 'link';
    }
  }
}
