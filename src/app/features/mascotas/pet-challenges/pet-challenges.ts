import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeResponseDTO } from '../../../models/challenge';
import { PetChallengeResponseDTO } from '../../../models/pet-challenge';
import { Category } from '../../../models/enums/category.enum';
import { Frequency } from '../../../models/enums/frequency.enum';
import { ChallengeService } from '../../../services/challenge/challenge.service';
import { PetChallengeService } from '../../../services/pet-challenge/pet-challenge.service';
import { PopupService } from '../../../services/pop_up/popup.service';
import { AdvertisementService } from '../../../services/advertisement/advertisement.service';
import { ZoneAd } from '../../../models/enums/zoneAd.enum';
import { take } from 'rxjs';
@Component({
  selector: 'app-pet-challenges',
  imports: [CommonModule],
  templateUrl: './pet-challenges.html',
  styleUrl: './pet-challenges.css',
})
export class PetChallenges implements OnInit {
  @Input() petId!: string;
  @Output() challengeCompleted = new EventEmitter<number>();

  isLoading = false;
  error: string | null = null;

  allChallenges: ChallengeResponseDTO[] = [];
  completedTodayIds: Set<string> = new Set();

  selectedFrequency: Frequency = Frequency.DIARIO;

  showModal = false;
  selectedChallenge: ChallengeResponseDTO | null = null;
  isSubmitting = false;

  Frequency = Frequency;
  Category = Category;

  protected readonly ZoneAd = ZoneAd;

  // propiedades para el Toast de Éxito
  showSuccessToast: boolean = false;
  successMessage: string = '';

  confettiPieces: number[] = Array(50).fill(0);

  constructor(
    private challengeService: ChallengeService,
    private petChallengeService: PetChallengeService,
    private popupService: PopupService,
    private advertisementService: AdvertisementService
  ) {}

  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.isLoading = true;
    this.error = null;

    this.challengeService.getActiveChallenges().subscribe({
      next: (challenges) => {
        this.allChallenges = challenges;

        this.petChallengeService.getPetChallengesToday(this.petId).subscribe({
          next: (completedToday) => {
            this.completedTodayIds = new Set(completedToday.map((pc) => pc.challengeId));
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error al cargar retos completados:', err);
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar retos:', err);
        this.error = 'No se pudieron cargar los retos. Intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }

  get filteredChallenges(): ChallengeResponseDTO[] {
    const filtered = this.allChallenges.filter(
      (challenge) => challenge.frequency === this.selectedFrequency
    );
    return filtered.sort((a, b) => {
      const aCompleted = this.isChallengeCompletedToday(a.id);
      const bCompleted = this.isChallengeCompletedToday(b.id);

      // Si a está completado y b no, b va primero
      if (aCompleted && !bCompleted) return 1;
      // Si b está completado y a no, a va primero
      if (!aCompleted && bCompleted) return -1;
      // Si ambos tienen el mismo estado, mantener orden original
      return 0;
    });
  }

  setFrequency(frequency: Frequency): void {
    this.selectedFrequency = frequency;
  }

  isChallengeCompletedToday(challengeId: string): boolean {
    return this.completedTodayIds.has(challengeId);
  }

  openConfirmModal(challenge: ChallengeResponseDTO): void {
    if (this.isChallengeCompletedToday(challenge.id)) {
      return;
    }
    this.selectedChallenge = challenge;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedChallenge = null;
  }

  confirmCompleteChallenge(): void {
    if (!this.selectedChallenge) return;

    this.isSubmitting = true;
    const challengeId = this.selectedChallenge.id;
    const pointsEarned = this.selectedChallenge.points;

    this.petChallengeService.completeChallenge(this.petId, challengeId).subscribe({
      next: (response) => {
        this.completedTodayIds.add(challengeId);
        this.closeModal();
        this.isSubmitting = false;

        this.challengeCompleted.emit(pointsEarned);

        this.successMessage = `+${pointsEarned} XP ganados!`;
        this.showSuccessToast = true;

        // Ocultar el toast después de 3 segundos
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 3000);
        setTimeout(() => {
          this.mostrarPopupDespuesDeReto();
        }, 3000);
      },
      error: (err) => {
        console.error('Error al completar reto:', err);
        alert('Hubo un error al completar el reto. Intenta de nuevo.');
        this.isSubmitting = false;

        if (err.status === 400 || err.status === 409) {
          const errorMessage = err.error?.message || 'Ya completaste este reto';
          alert(errorMessage);
          this.closeModal();
          this.loadChallenges();
        } else {
          alert('Hubo un error al completar reto');
        }
      },
    });
  }

  getCategoryIcon(category: Category): string {
    const icons: Record<Category, string> = {
      [Category.SALUD]: 'bi-heart-pulse',
      [Category.HIGIENE]: 'bi-droplet',
      [Category.JUEGO]: 'bi-balloon',
      [Category.ALIMENTACION]: 'bi-basket',
    };
    return icons[category] || 'bi-star';
  }

  getCategoryClass(category: Category): string {
    const classes: Record<Category, string> = {
      [Category.SALUD]: 'category-salud',
      [Category.HIGIENE]: 'category-higiene',
      [Category.JUEGO]: 'category-juego',
      [Category.ALIMENTACION]: 'category-alimentacion',
    };
    return classes[category] || '';
  }

  mostrarPopupDespuesDeReto() {
    this.advertisementService
      .getByZone(ZoneAd.POP_UP)
      .pipe(take(1))
      .subscribe({
        next: (popups) => {
          if (popups.length > 0) {
            this.popupService.mostrarSiguienteDeRotacion(popups);
          }
        },
      });
  }
  // Métodos para randomizar el confeti
  getRandomPosition(): number {
    return Math.random() * 100;
  }

  getRandomDelay(): number {
    return Math.random() * 0.5;
  }

  getRandomColor(): string {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
