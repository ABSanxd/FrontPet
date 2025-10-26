import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../mascotas/service/pet.service';
@Component({
  selector: 'app-perfil-pets-info',
  imports: [CommonModule],
  templateUrl: './perfil-pets-info.html',
  styleUrl: './perfil-pets-info.css',
})
export class PerfilPetsInfo implements OnInit {
  public petCount: number = 0;
  public maxPetsLimit: number = 2;

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.loadPetCount();
  }

  loadPetCount(): void {
    this.petService.countActivePets().subscribe({
      next: (count: number) => {
        this.petCount = count;
      },
      error: (err) => {
        console.error('Error al cargar conteo de mascotas', err), (this.petCount = 0);
      },
    });
  }
}
