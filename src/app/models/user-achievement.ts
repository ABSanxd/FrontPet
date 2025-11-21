import { AchievementType } from './enums/achievementType';

export interface UserAchievementDTO {
  id: string;
  completedAt: string;
  timesCompleted: number;
  userId: string;
  userName: string;
  achievementId: string;
  achievementName: string;
  achievementDescription: string;
  achievementPhrase: string;
  achievementType: AchievementType;

  achievementPoints: number;
  repeatable: boolean;
  requiredCount: number | null;
}
