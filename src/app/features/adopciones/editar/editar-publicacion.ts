import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { Species } from '../../../models/enums/species.enum';
import { Publication, UpdatePublicationDTO } from '../../../models/publication';

@Component({
  selector: 'app-editar-publicacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../crear/crear-publicacion.html', // Reutiliza el mismo HTML
  styleUrl: '../crear/crear-publicacion.css'
})
export class EditarPublicacion implements OnInit {
  publicationForm: FormGroup;
  loading = false;
  especies = Object.values(Species);
  photoPreview: string | null = null;
  photoBase64: string = '';
  publicationId: number = 0;
  isEditMode = true; // Para saber que estamos en modo edición
  originalPublication: Publication | null = null;

  constructor(
    private fb: FormBuilder,
    private publicationService: PublicationService,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    // Obtener el ID de la publicación desde la URL
    this.route.params.subscribe(params => {
      this.publicationId = +params['id'];
      if (this.publicationId) {
        this.loadPublication();
      } else {
        alert('ID de publicación no válido');
        this.router.navigate(['/adopciones']);
      }
    });
  }

  // Cargar los datos de la publicación
  loadPublication(): void {
    this.loading = true;
    this.publicationService.getPublicationById(this.publicationId).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.originalPublication = response.data;
          this.fillForm(response.data);
        } else {
          alert('No se pudo cargar la publicación');
          this.router.navigate(['/adopciones']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar publicación:', error);
        alert('Error al cargar la publicación');
        this.router.navigate(['/adopciones']);
        this.loading = false;
      }
    });
  }

  // Llenar el formulario con los datos existentes
  fillForm(publication: Publication): void {
    // Extraer ubicación de la descripción si existe
    let location = '';
    let description = publication.description;
    
    if (description.includes('Ubicación:')) {
      const parts = description.split('Ubicación:');
      description = parts[0].trim();
      location = parts[1]?.trim() || '';
    }

    // Llenar el formulario
    this.publicationForm.patchValue({
      tempName: publication.tempName,
      species: publication.species,
      approxAge: publication.approxAge,
      location: (publication.contact as any)?.location || location,
      description: description,
      adoptionInfo: (publication.contact as any)?.info || ''
    });

    // Mostrar la foto actual
    this.photoBase64 = publication.photo;
    this.photoPreview = publication.photo;
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
      
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. El tamaño máximo es 5MB');
        return;
      }

      this.compressImage(file);
    }
  }

  // Comprimir imagen antes de convertir a Base64
  compressImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
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
        ctx?.drawImage(img, 0, 0, width, height);
        
        this.photoBase64 = canvas.toDataURL('image/jpeg', 0.7);
        this.photoPreview = this.photoBase64;
        
        console.log('Imagen comprimida para edición');
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

  // Submit del formulario (EDITAR)
  onSubmit(): void {
    if (!this.photoBase64) {
      alert('Por favor mantén o sube una nueva foto de la mascota');
      return;
    }

    if (this.publicationForm.invalid) {
      Object.keys(this.publicationForm.controls).forEach(key => {
        this.publicationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    // Construir el DTO de actualización
    const dto: UpdatePublicationDTO = {
      tempName: this.publicationForm.value.tempName,
      species: this.publicationForm.value.species as Species,
      approxAge: this.publicationForm.value.approxAge,
      photo: this.photoBase64,
      description: `${this.publicationForm.value.description}\n\nUbicación: ${this.publicationForm.value.location}`,
      contact: {
        info: this.publicationForm.value.adoptionInfo,
        location: this.publicationForm.value.location
      }
    };

    console.log('Actualizando publicación ID:', this.publicationId);

    this.publicationService.updatePublication(this.publicationId, dto).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        if (response.status === 'success') {
          alert('¡Publicación actualizada exitosamente!');
          this.router.navigate(['/adopciones']);
        } else {
          alert('Error al actualizar la publicación: ' + (response.message || 'Error desconocido'));
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al actualizar publicación:', error);
        alert('Error al actualizar la publicación: ' + (error.error?.message || error.message));
        this.loading = false;
      }
    });
  }

  // Cancelar y volver
  onCancel(): void {
    if (this.publicationForm.dirty) {
      if (confirm('¿Estás seguro de cancelar? Se perderán los cambios.')) {
        this.router.navigate(['/adopciones']);
      }
    } else {
      this.router.navigate(['/adopciones']);
    }
  }
}