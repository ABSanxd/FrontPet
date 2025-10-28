import { Species } from './enums/species.enum';
import { Status } from './enums/status.enum';

export interface Contact {
  phone?: string;
  email?: string;
  whatsapp?: string;
  info?: string;
  location?: string;
  [key: string]: any;
}

export interface Publication {
  id: string;
  userId: string;
  tempName: string;
  species: Species;
  approxAge: string;
  photo: string;
  description: string;
  contact: Contact;
  status: Status;
  updateDate: string | null;
  creationDate: string;
  department: string;
  province: string;
  district: string;
  shared: number;
  likes: number;
}

export interface CreatePublicationDTO {
  tempName: string;
  species: Species;
  approxAge: string;
  photo: string;
  description: string;
  contact: Contact;
  department: string;
  province: string;
  district: string;
}

export interface UpdatePublicationDTO {
  tempName?: string;
  species?: Species;
  approxAge?: string;
  photo?: string;
  description?: string;
  contact?: Contact;
  status?: Status;
  department?: string;
  province?: string;
  district?: string;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  code?: number;
}