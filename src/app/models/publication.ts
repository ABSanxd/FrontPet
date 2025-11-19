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
  
  photos: string[]; 

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

  likedByMe: boolean;

  user?: {
    id: string;
    name: string;
  };
}
export interface CreatePublicationDTO {
  tempName: string;
  species: Species;
  approxAge: string;
  
  photos: string[]; 

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
  
  photos?: string[]; 

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

export interface AdoptionRequestCreateDTO {
  publicationId: string;
  message?: string;
}

export interface AdoptionRequest {
  id: string;
  status: Status; 
  createdAt: string; 
  message?: string;

  applicant: {
    userId: string;
    name: string;
    district: string;
    province: string;
  };
  
  publication: {
    publicationId: string;
    petName: string;
    petPhoto: string; 
    ownerId: string;
    ownerName: string;
  };
}