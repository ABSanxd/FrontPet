import { Component, Input, OnInit } from '@angular/core';
import { AchievementProgressDTO } from '../../../models/achievement';
import { AchievementService } from '../../../services/achievement/achievement.service';
import { ValidationPeriod } from '../../../models/enums/validationPeriod';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-pet-achievements',
  imports: [NgClass, CommonModule],
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

  constructor(private achievementService: AchievementService) {}

  ngOnInit(): void {
    if (this.petId) {
      this.loadAchievements();
      console.log('✅ petId recibido en PetAchievements:', this.petId);
    } else {
      console.error('❌ No hay petId!');
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
      (sum, req) => sum + req.progressPercentage,
      0
    );

    return Math.round(totalProgress / achievement.requirements.length);
  }

  getPeriodBadgeClass(period: ValidationPeriod): string {
    const classes: Record<ValidationPeriod, string> = {
      SEMANAL: 'badge-weekly',
      MENSUAL: 'badge-monthly',
      TOTAL: 'badge-total',
    };
    return classes[period] || 'badge-total';
  }

  getPeriodLabel(period: ValidationPeriod): string {
    const labels: Record<ValidationPeriod, string> = {
      SEMANAL: 'Semanal',
      MENSUAL: 'Mensual',
      TOTAL: 'Total',
    };
    return labels[period] || period;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getProgressBarClass(progress: number): string {
    if (progress === 100) return 'progress-complete';
    if (progress >= 75) return 'progress-high';
    if (progress >= 50) return 'progress-medium';
    if (progress >= 25) return 'progress-low';
    return 'progress-start';
  }

  // Cuenta cuántas veces se completó (si es repetible)
  getTimesCompleted(achievement: AchievementProgressDTO): number {
    // Si todos los requisitos están al 100%, cuenta como 1 vez
    const allCompleted = achievement.requirements.every((req) => req.completed);
    return allCompleted ? 1 : 0;
  }
}
