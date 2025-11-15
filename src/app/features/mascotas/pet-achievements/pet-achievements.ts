import { Component, Input, OnInit } from '@angular/core';
import { AchievementProgressDTO } from '../../../models/achievement';
import { AchievementService } from '../../../services/achievement/achievement.service';
import { ValidationPeriod } from '../../../models/enums/validationPeriod';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-pet-achievements',
  imports: [CommonModule],
  templateUrl: './pet-achievements.html',
  styleUrl: './pet-achievements.css',
})
export class PetAchievements implements OnInit {
  @Input() petId!: string;

  allAchievements: AchievementProgressDTO[] = [];
  completedAchievements: AchievementProgressDTO[] = [];
  inProgressAchievements: AchievementProgressDTO[] = [];
  lockedAchievements: AchievementProgressDTO[] = [];

  isLoading = true;
  error: string | null = null;

  selectedView: 'all' | 'completed' | 'inProgress' = 'all';

  expandedAchievements: { [key: string]: boolean } = {};

  constructor(private achievementService: AchievementService) {}

  ngOnInit(): void {
    if (this.petId) {
      this.loadAchievements();
    }
  }
  loadAchievements(): void {
    this.isLoading = true;
    this.error = null;

    this.achievementService.getAllAchievementsProgress(this.petId).subscribe({
      next: (achievements) => {
        this.allAchievements = achievements;
        this.categorizeAchievements();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando logros:', err);
        this.error = 'No se pudieron cargar los logros';
        this.isLoading = false;
      },
    });
  }

  categorizeAchievements(): void {
    this.completedAchievements = this.allAchievements.filter((a) => a.completed);

    this.inProgressAchievements = this.allAchievements.filter((a) => {
      if (a.completed) return false;
      const hasProgress = a.requirements.some((req) => req.currentProgress > 0);
      return hasProgress;
    });

    this.lockedAchievements = this.allAchievements.filter((a) => {
      if (a.completed) return false;
      const hasProgress = a.requirements.some((req) => req.currentProgress > 0);
      return !hasProgress;
    });
  }

  getAchievementsToShow(): AchievementProgressDTO[] {
    switch (this.selectedView) {
      case 'completed':
        return this.completedAchievements;
      case 'inProgress':
        return this.inProgressAchievements;
      default:
        return this.allAchievements;
    }
  }

  // Calcula el progreso total del logro
  getTotalProgress(achievement: AchievementProgressDTO): number {
    if (achievement.requirements.length === 0) return 0;

    const totalProgress = achievement.requirements.reduce(
      (sum, req) => sum + Math.min(req.progressPercentage, 100), // Limitar cada req a 100%
      0
    );

    return Math.min(Math.round(totalProgress / achievement.requirements.length), 100); // Limitar total a 100%
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Mes es 0-indexed

    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getProgressBarClass(progress: number): string {
    if (progress >= 100) return 'progress-complete';
    if (progress >= 75) return 'progress-high';
    if (progress >= 50) return 'progress-medium';
    if (progress >= 25) return 'progress-low';
    return 'progress-start';
  }

  getProgressColor(progress: number): string {
    if (progress >= 100) return '#A5B463';
    if (progress >= 75) return '#1E8C88';
    if (progress >= 50) return '#EE8E4F';
    if (progress >= 25) return '#3498db';
    return '#95a5a6'; // Gris
  }

  // Cuenta requisitos completados
  getCompletedRequirements(achievement: AchievementProgressDTO): number {
    return achievement.requirements.filter((req) => req.completed).length;
  }

  //para expandir/colapsar requisitos
  toggleRequirements(achievementId: string): void {
    this.expandedAchievements[achievementId] = !this.expandedAchievements[achievementId];
  }

  // Cuenta cuántas veces se completó (si es repetible)
  getTimesCompleted(achievement: AchievementProgressDTO): number {
    // Si todos los requisitos están al 100%, cuenta como 1 vez
    const allCompleted = achievement.requirements.every((req) => req.completed);
    return allCompleted ? 1 : 0;
  }
}
