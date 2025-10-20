
import { PriorityAd } from "./enums/priorityAd.enum";
import { SocialMediaType } from "./enums/socialMediaType.enum";
import { ZoneAd } from "./enums/zoneAd.enum";

export interface AdvertisementResponseDTO {
  id: string;
  name: string;
  description: string;
  link: string;
  imageUrl: string;
  zone: ZoneAd;
  priority: PriorityAd;
  contact: ContactDetails;
  startDate: string; // "2025-01-01"
  endDate: string;
}

export interface ContactDetails {
  email?: string;
  phone?: string;
  address?: string;
  socialMedia?: SocialMedia;
}

export interface SocialMedia {
  type: SocialMediaType;
  url: string;
}

