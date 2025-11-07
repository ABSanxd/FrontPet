import { Status } from "./enums/status.enum";
import { PetLevel } from "./enums/pet-level.enum";
import { Species } from "./enums/species.enum";

export interface PetResponseDTO {
  id: string;
  userId: string;
  nombre: string;
  especie: Species;
  nivel: PetLevel;
  petXp: number;
  breed?: string;
  
  ageYears?: number;  
  ageMonths?: number; 
  birthDate?: string;

  petWeight?: number;
  photo?: string;
  status: Status;
  createdAt: string; 
  updatedIn?: string; 
}

export interface PetCreateDTO {
  nombre: string;
  especie: Species;
  breed?: string;
  
  birthDate?: string; 
  
  petWeight?: number;
  photo?: string;
}

export interface PetUpdateDTO {
  nombre?: string;
  especie?: Species;
  breed?: string;

  birthDate?: string;

  petWeight?: number;
  photo?: string;
}