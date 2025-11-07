import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PetService } from '../service/pet.service';
import { Species } from '../../../models/enums/species.enum';
import { PetCreateDTO, PetUpdateDTO } from '../../../models/pet';

@Component({
  selector: 'app-registrar-mascota',
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './registrar-mascota.html',
  styleUrl: './registrar-mascota.css'
})
export class RegistrarMascota implements OnInit {
  
  petForm!: FormGroup;
  speciesList: string[] = Object.values(Species);
  
  isLoading = false;
  error = '';
  previewUrl: string | ArrayBuffer | null = null;
  
  isEditMode = false;
  currentPetId: string | null = null;

  maxDate: string;
  
  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private router: Router,
    private route: ActivatedRoute 
  ) {
    this.maxDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.petForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      especie: ['', Validators.required],
      breed: ['', Validators.maxLength(100)],
      
      birthDate: [null], 

      petWeight: [null, [Validators.min(0.1), Validators.max(999.99)]],
      photo: [null]
    });

    this.currentPetId = this.route.snapshot.paramMap.get('id');

    if (this.currentPetId) {
      this.isEditMode = true;
      this.loadPetData(this.currentPetId);
    }
  }

  loadPetData(id: string): void {
    this.isLoading = true;
    this.petService.getPetById(id).subscribe({
      next: (pet) => {
        this.petForm.patchValue({
          nombre: pet.nombre,
          especie: pet.especie,
          breed: pet.breed,
          
          birthDate: pet.birthDate, 
          petWeight: pet.petWeight
        });
        
        if (pet.photo) {
          this.previewUrl = pet.photo;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'No se pudieron cargar los datos de la mascota.';
        console.error(err);
      }
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.petForm.markAllAsTouched();
    
    if (this.petForm.invalid) {
      this.error = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    this.isLoading = true;
    this.error = '';


    const petData: PetCreateDTO | PetUpdateDTO = {
      nombre: this.petForm.value.nombre,
      especie: this.petForm.value.especie,
      breed: this.petForm.value.breed || undefined,
      
     
      birthDate: this.petForm.value.birthDate || undefined,

      petWeight: this.petForm.value.petWeight || undefined,
      photo: this.previewUrl as string | undefined 
    };

    if (this.isEditMode && this.currentPetId) {

      this.petService.updatePet(this.currentPetId, petData).subscribe({
        next: (updatedPet) => {
          this.isLoading = false;
          this.router.navigate(['/mascotas', updatedPet.id]);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error?.message || 'Error al actualizar la mascota.';
          console.error(err);
        }
      });

    } else {
     
      this.petService.createPet(petData as PetCreateDTO).subscribe({
        next: (newPet) => {
          this.isLoading = false;
          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error?.message || 'Error al registrar la mascota.';
          console.error(err);
        }
      });
    }
  }

  get f() {
    return this.petForm.controls;
  }
}