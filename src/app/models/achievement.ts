import { AchievementType } from "./enums/achievementType";
import { Status } from "./enums/status.enum";
import { ValidationPeriod } from "./enums/validationPeriod";


// DTO de requisito con progreso
export interface RequirementProgressDTO {
  requirementId: string;
  challengeId: string;
  challengeName: string;
  challengeCategory: string;
  currentProgress: number;
  totalRequired: number;
  progressPercentage: number;
  completed: boolean;
}

// DTO de logro con progreso
export interface AchievementProgressDTO {
  achievementId: string;
  achievementName: string;
  achievementDescription: string;
  achievementPhrase: string;
  repeatable: boolean;
  completed: boolean;
  countFromCreation: boolean;
  periodStart: string; // LocalDate 
  periodEnd: string;
  validationPeriod: ValidationPeriod;
  requirements: RequirementProgressDTO[];
}

// DTO de logro completado por mascota
export interface PetAchievementResponseDTO {
  id: string;
  petId: string;
  petName: string;
  achievementId: string;
  achievementName: string;
  achievementDescription: string;
  achievementPhrase: string;
  achievementType: AchievementType;
  repeatable: boolean;
  countFromCreation: boolean;
  periodStart: string;
  periodEnd: string;
  status: Status;
  completedAt: string | null; // LocalDateTime 
  createdAt: string;
}