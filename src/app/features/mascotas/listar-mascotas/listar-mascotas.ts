import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PetService } from '../service/pet.service'; 
import { Pet } from '../../../models/pet';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PetLevel } from '../../../models/enums/pet-level.enum';

@Component({
  selector: 'app-listar-mascotas',
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-mascotas.html',
  styleUrl: './listar-mascotas.css'
})
export class ListarMascotas implements OnInit {

  pets: Pet[] = [];
  userName: string = '';
  isLoading = true;
  error = '';
  
  readonly addPetImg = 'assets/img/img-nueva-publicacion-01.png';

  constructor(
    private petService: PetService,
    private authService: AuthService
  ) { }

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
      }
    });
  }

// Helper para dar color a los niveles
  getPetLevelClass(level: PetLevel): string {
    switch(level) {
      case PetLevel.ALFA:
      case PetLevel.MAESTRO:
        return 'level-gold';
      case PetLevel.CAZADOR:
        return 'level-silver';
      default:
        return 'level-bronze';
    }
  }

  // Helper para manejar imágenes rotas
  onImageError(event: any): void {
    event.target.src = 'assets/pet-placeholder.png'; 
  }
}