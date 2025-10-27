import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicationService } from '../publication.service';
import { UbigeoService } from '../../../services/ubigeo/ubigeo.service';
import { Species } from '../../../models/enums/species.enum';
import { CreatePublicationDTO, Publication, UpdatePublicationDTO } from '../../../models/publication';

@Component({
  selector: 'app-crear-publicacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-publicacion.html',
  styleUrl: './crear-publicacion.css'
})
export class CrearPublicacion implements OnInit {
  publicationForm: FormGroup;
  loading = false;
  especies = Object.values(Species);
  photoPreview: string | null = null;
  photoBase64: string = '';
  isEditMode = false;
  publicationId: string = '';

  // Ubigeo
  departments: string[] = [];
  provinces: string[] = [];
  districts: string[] = [];

  constructor(
    private fb: FormBuilder,
    private publicationService: PublicationService,
    private ubigeoService: UbigeoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.publicationForm = this.fb.group({
      tempName: ['', [Validators.required, Validators.minLength(2)]],
      species: ['', Validators.required],
      approxAge: ['', Validators.required],
      department: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      adoptionInfo: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Verificar si hay ID en la ruta (modo edición)
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.publicationId = params['id'];
        this.loadPublication();
      }
    });

    // Cargar departamentos
    this.loadDepartments();

    // Escuchar cambios en departamento
    this.publicationForm.get('department')?.valueChanges.subscribe(dep => {
      if (dep) {
        this.onDepartmentChange();
      }
    });

    // Escuchar cambios en provincia
    this.publicationForm.get('province')?.valueChanges.subscribe(prov => {
      if (prov) {
        this.onProvinceChange();
      }
    });
  }

  loadDepartments(): void {
    this.ubigeoService.getDepartments().subscribe({
      next: (deps: string[]) => {
        this.departments = deps;
      },
      error: (err: any) => console.error('Error cargando departamentos:', err)
    });
  }

  onDepartmentChange(): void {
    // Resetear provincia y distrito
    this.publicationForm.patchValue({ 
      province: '', 
      district: '' 
    });
    this.provinces = [];
    this.districts = [];

    const dep = this.publicationForm.get('department')?.value;
    if (!dep) return;

    this.ubigeoService.getProvinces(dep).subscribe({
      next: (provs: string[]) => {
        this.provinces = provs;
      },
      error: (err: any) => console.error('Error cargando provincias:', err)
    });
  }

  onProvinceChange(): void {
    // Resetear distrito
    this.publicationForm.patchValue({ 
      district: '' 
    });
    this.districts = [];

    const dep = this.publicationForm.get('department')?.value;
    const prov = this.publicationForm.get('province')?.value;
    
    if (!dep || !prov) return;

    this.ubigeoService.getDistricts(dep, prov).subscribe({
      next: (dists: string[]) => {
        this.districts = dists;
      },
      error: (err: any) => console.error('Error cargando distritos:', err)
    });
  }

  // Cargar publicación existente (modo edición)
  loadPublication(): void {
    this.loading = true;
    this.publicationService.getPublicationById(this.publicationId).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
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

  // Llenar formulario con datos existentes
  fillForm(publication: Publication): void {
    // Primero cargar provincias y distritos ANTES de setear el formulario
    if (publication.department) {
      this.ubigeoService.getProvinces(publication.department).subscribe({
        next: (provs: string[]) => {
          this.provinces = provs;
          
          if (publication.province) {
            this.ubigeoService.getDistricts(publication.department, publication.province).subscribe({
              next: (dists: string[]) => {
                this.districts = dists;
                
                // Ahora sí llenar el formulario con todos los datos
                this.setFormValues(publication);
              }
            });
          } else {
            this.setFormValues(publication);
          }
        }
      });
    } else {
      this.setFormValues(publication);
    }

    // Mostrar foto actual
    this.photoBase64 = publication.photo;
    this.photoPreview = publication.photo;
  }

  // Método auxiliar para setear valores sin disparar eventos
  private setFormValues(publication: Publication): void {
    this.publicationForm.patchValue({
      tempName: publication.tempName,
      species: publication.species,
      approxAge: publication.approxAge,
      department: publication.department,
      province: publication.province,
      district: publication.district,
      description: publication.description,
      adoptionInfo: (publication.contact as any)?.info || ''
    }, { emitEvent: false }); // IMPORTANTE: no emitir eventos
  }

  get f() {
    return this.publicationForm.controls;
  }

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
        
        console.log('Tamaño original:', file.size, 'bytes');
        console.log('Tamaño comprimido:', this.photoBase64.length, 'caracteres');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

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

  onSubmit(): void {
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

    if (this.isEditMode) {
      this.updatePublication();
    } else {
      this.createPublication();
    }
  }

  createPublication(): void {
    const dto: CreatePublicationDTO = {
      tempName: this.publicationForm.value.tempName,
      species: this.publicationForm.value.species as Species,
      approxAge: this.publicationForm.value.approxAge,
      photo: this.photoBase64,
      description: this.publicationForm.value.description,
      contact: {
        info: this.publicationForm.value.adoptionInfo
      },
      department: this.publicationForm.value.department,
      province: this.publicationForm.value.province,
      district: this.publicationForm.value.district
    };

    console.log('Creando publicación:', { ...dto, photo: dto.photo.substring(0, 50) + '...' });

    this.publicationService.createPublication(dto).subscribe({
      next: (response) => {
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

  updatePublication(): void {
    const dto: UpdatePublicationDTO = {
      tempName: this.publicationForm.value.tempName,
      species: this.publicationForm.value.species as Species,
      approxAge: this.publicationForm.value.approxAge,
      photo: this.photoBase64,
      description: this.publicationForm.value.description,
      contact: {
        info: this.publicationForm.value.adoptionInfo
      },
      department: this.publicationForm.value.department,
      province: this.publicationForm.value.province,
      district: this.publicationForm.value.district
    };

    console.log('Actualizando publicación ID:', this.publicationId);

    this.publicationService.updatePublication(this.publicationId, dto).subscribe({
      next: (response) => {
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