import { Component, Input } from '@angular/core';
import { UserAchievementDTO } from '../../../models/user-achievement';
import { UserAchievementService } from '../../../services/user_achievement/user-achievement.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-achievements',
  imports: [NgClass],
  templateUrl: './user-achievements.html',
  styleUrl: './user-achievements.css',
})
export class UserAchievements {
  @Input() userId!: string;

  allAchievements: UserAchievementDTO[] = [];
  rescuerAchievements: UserAchievementDTO[] = [];
  adopterAchievements: UserAchievementDTO[] = [];

  isLoading = true;
  error: string | null = null;

  selectedTab: 'all' | 'rescuer' | 'adopter' = 'all';

  private achievementImageMap: { [key: string]: string } = {
    // RESCATISTAS
    'Buscador de hogares': '../assets/user-achievements/rescuer/buscador-hogares.png',
    'Puente de vida': '../assets/user-achievements/rescuer/puente-vida.png',
    'Red de rescate Master': '../assets/user-achievements/rescuer/red-rescate-master.png',
    'Mano amiga': '../assets/user-achievements/rescuer/mano-amiga.png',

    // ADOPTANTES
    'Corazón de oro': '../assets/user-achievements/adopter/corazon-oro.png',
    'Familia creciente': '../assets/user-achievements/adopter/familia-creciente.png',
    'Ángel guardián': '../assets/user-achievements/adopter/angel-guardian.png',
    'Héroe pets': '../assets/user-achievements/adopter/heroe-pets.png',
  };

  constructor(private achievementService: UserAchievementService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadAchievements();
    }
  }

  loadAchievements(): void {
    this.isLoading = true;
    this.error = null;

    this.achievementService.getUserAchievements(this.userId).subscribe({
      next: (achievements) => {
        this.allAchievements = achievements;
        this.categorizeAchievements();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando logros:', err);
        this.error = 'No se pudieron cargar los logros';
        this.isLoading = false;
      }
    });
  }

  categorizeAchievements(): void {
    this.rescuerAchievements = this.allAchievements.filter(
      a => a.achievementType === 'USUARIO_RESCATISTA'
    );
    this.adopterAchievements = this.allAchievements.filter(
      a => a.achievementType === 'USUARIO_ADOPTANTE'
    );
  }

  getAchievementsToShow(): UserAchievementDTO[] {
    switch (this.selectedTab) {
      case 'rescuer':
        return this.rescuerAchievements;
      case 'adopter':
        return this.adopterAchievements;
      default:
        return this.allAchievements;
    }
  }

  // Determina qué icono/imagen mostrar según el tipo y si es repetible

  getAchievementIcon(achievement: UserAchievementDTO): string {
    const imagePath = this.achievementImageMap[achievement.achievementName];
    
    if (imagePath) {
      return imagePath;
    }

    // Fallback: imagen genérica según tipo
    if (achievement.achievementType === 'USUARIO_RESCATISTA') {
      return achievement.repeatable 
        ? '../assets/user-achievements/rescuer/mano-amiga.png'
        : '../assets/user-achievements/rescuer/mano-amiga.png';
    } else {
      return achievement.repeatable 
        ? '../assets/user-achievements/adopter/heroe-pets.png'
        : '../assets/user-achievements/adopter/heroe-pets.png';
    }
  }

  /**
   * Clase CSS según el tipo
   */
  getAchievementClass(achievement: UserAchievementDTO): string {
    if (achievement.achievementType === 'USUARIO_RESCATISTA') {
      return achievement.repeatable ? 'achievement-rescuer-standard' : 'achievement-rescuer-special';
    } else {
      return achievement.repeatable ? 'achievement-adopter-standard' : 'achievement-adopter-special';
    }
  }

  /**
   * Formato de fecha
   */
  formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
