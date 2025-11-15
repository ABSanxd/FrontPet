export interface PetChallengeResponseDTO {
  id: string;
  petId: string;
  challengeId: string;
  createdAt: string;
  challengeName: string;
  pointsEarned: number;
}

/**
 * DTO para completar un reto (PetChallengeCreateDTO del backend)
 */
export interface PetChallengeCreateDTO {
  challengeId: string;
}

export type PetChallenge = PetChallengeResponseDTO;