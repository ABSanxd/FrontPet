import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetService } from '../service/pet.service';
import { Pet } from '../../../models/pet';
import { PetLevel } from '../../../models/enums/pet-level.enum';

@Component({
  selector: 'app-detalles-mascota',
  imports: [CommonModule, RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './detalles-mascota.html',
  styleUrl: './detalles-mascota.css'
})
export class DetallesMascota implements OnInit {

  pet: Pet | null = null;
  isLoading = true;
  error = '';

  //XP Máximo por nivel 
  private levelXpThresholds: Record<PetLevel, number> = {
    [PetLevel.NOVATO]: 5000,
    [PetLevel.EXPLORADOR]: 10000,
    [PetLevel.CAZADOR]: 20000,
    [PetLevel.MAESTRO]: 50000,
    [PetLevel.ALFA]: Infinity // Nivel máximo
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router,      
    private petService: PetService 
  ) { }

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('id');

    if (!petId) {
      this.error = 'No se encontró el ID de la mascota.';
      this.isLoading = false;
      return;
    }

    this.loadPetDetails(petId);
  }

  loadPetDetails(id: string): void {
    this.isLoading = true;
    this.error = '';

    this.petService.getPetById(id).subscribe({
      next: (data) => {
        this.pet = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle de mascota:', err);
        this.error = 'No se pudo encontrar la mascota.';
        this.isLoading = false;
      }
    });
  }

  //Devuelve la imagen de la medalla según el nivel
  getPetLevelImage(level: PetLevel): string {
    const images: Record<PetLevel, string> = {
      [PetLevel.NOVATO]: 'assets/img-level-bronce.png',
      [PetLevel.EXPLORADOR]: 'assets/img-level-plata.png',
      [PetLevel.CAZADOR]: 'assets/img-level-oro.png',
      [PetLevel.MAESTRO]: 'assets/img-level-maestro.png',
      [PetLevel.ALFA]: 'assets/img-level-alfa.png',
    };
    return images[level] || images[PetLevel.NOVATO];
  }

  //Devuelve el XP máximo para el nivel actual
  getMaxXPForLevel(level: PetLevel): number {
    return this.levelXpThresholds[level] || 5000;
  }

  //Calcula el porcentaje de XP para la barra de progreso
  getPetXPPercentage(xp: number, level: PetLevel): number {
    const maxXP = this.getMaxXPForLevel(level);
    if (maxXP === Infinity) return 100; // Nivel ALFA está al 100%
    return (xp / maxXP) * 100;
  }
  
  //Manejador de error de imagen
  onImageError(event: any): void {
    event.target.src = 'assets/img/pet-placeholder.png'; 
  }

  onDeletePet(): void {
    if (!this.pet) return;

    const wantsDelete = confirm(`¿Estás seguro de que quieres eliminar a ${this.pet.nombre}? Esta acción no se puede deshacer.`);
    
    if (wantsDelete) {
      this.isLoading = true; 
      this.petService.deletePet(this.pet.id).subscribe({
        next: () => {
          this.router.navigate(['/mascotas']); 
        },
        error: (err) => {
          console.error('Error al eliminar mascota:', err);
          this.error = 'Error al eliminar la mascota. Inténtalo de nuevo.';
          this.isLoading = false;
        }
      });
    }
  }


}