import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicationService } from '../publication.service';
import { Species } from '../../../models/enums/species.enum';
import { CreatePublicationDTO } from '../../../models/publication';

@Component({
  selector: 'app-crear-publicacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-publicacion.html',
  styleUrl: './crear-publicacion.css'
})
export class CrearPublicacion {
  publicationForm: FormGroup;
  loading = false;
  especies = Object.values(Species);
  photoPreview: string | null = null;
  photoBase64: string = '';
  isEditMode = false; // Para que el HTML sepa que está en modo crear

  constructor(
    private fb: FormBuilder,
    private publicationService: PublicationService,
    private router: Router
  ) {
    this.publicationForm = this.fb.group({
      tempName: ['', [Validators.required, Validators.minLength(2)]],
      species: ['', Validators.required],
      approxAge: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      adoptionInfo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Obtener control del formulario para validaciones
  get f() {
    return this.publicationForm.controls;
  }

  // Manejar selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. El tamaño máximo es 5MB');
        return;
      }

      // Comprimir y convertir a Base64
      this.compressImage(file);
    }
  }

  // Comprimir imagen antes de convertir a Base64
  compressImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        // Crear canvas para redimensionar
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calcular nuevas dimensiones (máximo 800px en el lado más largo)
        let width = img.width;
        let height = img.height;
        const maxSize = 800;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir a Base64 con compresión (calidad 0.7)
        this.photoBase64 = canvas.toDataURL('image/jpeg', 0.7);
        this.photoPreview = this.photoBase64;
        
        console.log('Tamaño original:', file.size, 'bytes');
        console.log('Tamaño comprimido:', this.photoBase64.length, 'caracteres');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Trigger click en input file
  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  // Obtener emoji según especie
  getSpeciesEmoji(species: string): string {
    const emojis: { [key: string]: string } = {
      'PERRO': '🐶',
      'GATO': '🐱',
      'AVE': '🐦',
      'CONEJO': '🐰',
      'OTRO': '🦊'
    };
    return emojis[species] || '🐾';
  }

  // Obtener label de especie
  getSpeciesLabel(species: string): string {
    const labels: { [key: string]: string } = {
      'PERRO': 'Perro',
      'GATO': 'Gato',
      'AVE': 'Ave',
      'CONEJO': 'Conejo',
      'OTRO': 'Otro'
    };
    return labels[species] || species;
  }

  // Submit del formulario
  onSubmit(): void {
    // Validar que haya foto
    if (!this.photoBase64) {
      alert('Por favor sube una foto de la mascota');
      return;
    }

    if (this.publicationForm.invalid) {
      Object.keys(this.publicationForm.controls).forEach(key => {
        this.publicationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    // Construir el DTO con la información de contacto desde adoptionInfo
    const dto: CreatePublicationDTO = {
      tempName: this.publicationForm.value.tempName,
      species: this.publicationForm.value.species as Species,
      approxAge: this.publicationForm.value.approxAge,
      photo: this.photoBase64, // Base64 string
      description: `${this.publicationForm.value.description}\n\nUbicación: ${this.publicationForm.value.location}`,
      contact: {
        info: this.publicationForm.value.adoptionInfo,
        location: this.publicationForm.value.location
      }
    };

    console.log('Enviando publicación (foto truncada):', {
      ...dto,
      photo: dto.photo.substring(0, 50) + '...'
    });

    this.publicationService.createPublication(dto).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        if (response.status === 'success') {
          alert('¡Publicación creada exitosamente! Está pendiente de aprobación.');
          this.router.navigate(['/adopciones']);
        } else {
          alert('Error al crear la publicación: ' + (response.message || 'Error desconocido'));
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al crear publicación:', error);
        alert('Error al crear la publicación: ' + (error.error?.message || error.message));
        this.loading = false;
      }
    });
  }

  // Cancelar y volver
  onCancel(): void {
    if (this.publicationForm.dirty || this.photoBase64) {
      if (confirm('¿Estás seguro de cancelar? Se perderán los cambios.')) {
        this.router.navigate(['/adopciones']);
      }
    } else {
      this.router.navigate(['/adopciones']);
    }
  }
}