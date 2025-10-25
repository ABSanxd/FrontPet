import { Status } from "./enums/status.enum";
import { PetLevel } from "./enums/pet-level.enum";
import { Species } from "./enums/species.enum";

export interface Pet {
  id: string;
  userId: string;
  nombre: string;
  especie: Species;
  nivel: PetLevel;
  petXp: number;
  breed?: string;
  petAge?: number;
  petWeight?: number;
  photo?: string;
  status: Status;
  createdAt: string; 
  updatedIn?: string; 
}

export interface PetCreateRequest {
  nombre: string;
  especie: Species;
  breed?: string;
  petAge?: number;
  petWeight?: number;
  photo?: string;
}


export interface PetUpdateRequest {
  nombre?: string;
  especie?: Species;
  breed?: string;
  petAge?: number;
  petWeight?: number;
  photo?: string;
}