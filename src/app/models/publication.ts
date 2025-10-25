import { Species } from './enums/species.enum';
import { Status } from './enums/status.enum';

export interface Contact {
  phone?: string;
  email?: string;
  whatsapp?: string;
  [key: string]: any;
}

export interface Publication {
  id: number;
  tempName: string;
  species: Species;
  approxAge: string;
  photo: string;
  description: string;
  contact: Contact;
  status: Status;
  creationDate: string;
  updateDate?: string;
  userId: string;
  otros?: string;
}

export interface CreatePublicationDTO {
  tempName: string;
  species: Species;
  approxAge: string;
  photo: string;
  description: string;
  contact: Contact;
  otros?: string;
  userId?: string;
}

export interface UpdatePublicationDTO {
  tempName?: string;
  species?: Species;
  approxAge?: string;
  photo?: string;
  description?: string;
  contact?: Contact;
  status?: Status;
  otros?: string;
}

export interface ApiResponse<T> {
  status: string; // "success" o "error"
  data?: T;
  message?: string;
  code?: number;
}