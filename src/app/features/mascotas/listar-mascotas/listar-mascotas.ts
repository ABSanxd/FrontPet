import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PetService } from '../service/pet.service';
import { PetResponseDTO } from '../../../models/pet'; // Importado
import { AuthService } from '../../../core/services/auth/auth.service';
import { PetLevel } from '../../../models/enums/pet-level.enum';

@Component({
  selector: 'app-listar-mascotas',
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-mascotas.html',
  styleUrl: './listar-mascotas.css',
})
export class ListarMascotas implements OnInit {
  pets: PetResponseDTO[] = [];
  userName: string = '';
  isLoading = true;
  error = '';

  readonly addPetImg = 'assets/animalitos.svg'; 


  protected readonly PetLevel = PetLevel;

  // Umbrales de XP basados en tu lógica de backend (PetService.java)
  //
  protected readonly levelXpThresholds: Record<
    PetLevel,
    { min: number; max: number }
  > = {
    [PetLevel.NOVATO]: { min: 0, max: 100 },
    [PetLevel.EXPLORADOR]: { min: 101, max: 350 },
    [PetLevel.CAZADOR]: { min: 351, max: 500 },
    [PetLevel.MAESTRO]: { min: 501, max: 1000 },
    [PetLevel.ALFA]: { min: 1001, max: 2000 },
  };

  constructor(
    private petService: PetService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserName();
    this.loadPets();
  }

  loadUserName(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name.split(' ')[0];
    }
  }

  loadPets(): void {
    this.isLoading = true;
    this.error = '';

    this.petService.getAllPetsByUser().subscribe({
      next: (data) => {
        this.pets = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar mascotas:', err);
        this.error = 'No se pudieron cargar tus mascotas. Intenta de nuevo.';
        this.isLoading = false;
      },
    });
  }

  getPetLevelClass(level: PetLevel): string {
    switch (level) {
      case PetLevel.ALFA:
      case PetLevel.MAESTRO:
        return 'level-gold';
      case PetLevel.CAZADOR:
        return 'level-silver';
      default:
        return 'level-bronze';
    }
  }

  onImageError(event: any): void {
    event.target.src = 'assets/pet-placeholder.png';
  }

  getEdadFormateada(pet: PetResponseDTO): string {
    if (!pet || (pet.ageYears === undefined && pet.ageMonths === undefined)) {
      return 'Edad no especificada';
    }
    const years = pet.ageYears ?? 0;
    const months = pet.ageMonths ?? 0;
    if (years === 0 && months === 0) {
      return pet.birthDate ? 'Menos de 1 mes' : 'No especificada';
    }
    const yearText = years > 0 ? `${years} ${years === 1 ? 'año' : 'años'}` : '';
    const monthText =
      months > 0 ? `${months} ${months === 1 ? 'mes' : 'meses'}` : '';
    return [yearText, monthText].filter(Boolean).join(' y ');
  }

  getPetXPPercentage(xp: number, level: PetLevel): number {
    const thresholds = this.levelXpThresholds[level];
    if (!thresholds) return 0;

    if (level === PetLevel.ALFA) return 100;
    
    const levelXP = Math.max(0, xp - thresholds.min);
    const levelRange = thresholds.max - thresholds.min;
    
    if (levelRange <= 0) return 100;

    const percentage = (levelXP / levelRange) * 100;
    return Math.max(0, Math.min(percentage, 100));
  }

  getXPText(xp: number, level: PetLevel): string {
    const maxXP = this.levelXpThresholds[level]?.max;
    if (level === PetLevel.ALFA) return `${xp} XP (NIVEL MÁXIMO)`;
    return `${xp} / ${maxXP} XP`;
  }
}