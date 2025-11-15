import { Category } from './enums/category.enum';
import { Frequency } from './enums/frequency.enum';
import { Status } from './enums/status.enum';

export interface ChallengeResponseDTO {
  id: string;
  name: string;
  description: string;
  frequency: Frequency;
  points: number;
  category: Category;
  image: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

//no lo uso pero por si acaso
export interface ChallengeCreateDTO {
  name: string;
  description: string;
  frequency: Frequency;
  category: Category;
  image?: string;
  points: number;
}

export interface ChallengeUpdateDTO {
  name?: string;
  description?: string;
  frequency?: Frequency;
  category?: Category;
  image?: string;
  points?: number;
}

export type Challenge = ChallengeResponseDTO;
