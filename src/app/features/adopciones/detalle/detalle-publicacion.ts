import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicationService } from '../publication.service';
import { AdoptionRequestService } from '../adoption-request.service';
import { Publication, AdoptionRequestCreateDTO } from '../../../models/publication';
import { Species } from '../../../models/enums/species.enum';
import { AuthService } from '../../../core/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detalle-publicacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-publicacion.html',
  styleUrl: './detalle-publicacion.css'
})
export class DetallePublicacion implements OnInit {

  publication: Publication | null = null;
  isLoading = true;
  error = '';
  
  // Para el modal de confirmación
  showConfirmModal = false;
  isSubmitting = false; 
  modalError = ''; 
  showSuccessModal = false; 
  
  showShareModal = false; // <-- Estado para el modal de compartir
  
  isOwner = false;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private publicationService: PublicationService,
    private adoptionRequestService: AdoptionRequestService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const publicationId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.authService.getUser();

    if (!publicationId) {
      this.error = 'No se encontró el ID de la publicación.';
      this.isLoading = false;
      return;
    }

    this.publicationService.getPublicationById(publicationId).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.publication = response.data;
          // Comprobamos si el usuario actual es el dueño de la publicación
          if (currentUser && this.publication.user && currentUser.id === this.publication.user.id) {
            this.isOwner = true;
          }
        } else {
          this.error = 'No se pudo cargar la publicación.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudo encontrar la publicación.';
        this.isLoading = false;
      }
    });
  }

  // Maneja el clic en "Enviar Solicitud de Adopción"
  onShowModal(): void {
    this.modalError = '';
    this.showConfirmModal = true;
  }

  onCloseModal(): void {
    if (!this.isSubmitting) {
      this.showConfirmModal = false;
    }
  }

  onCloseSuccessModal(): void {
    this.showSuccessModal = false;
    this.location.back(); // Volvemos a la lista después de cerrar el modal de éxito
  }

  // Maneja el clic en "Si, aceptar" del modal
  onConfirmAdoption(): void {
    if (!this.publication) return;

    this.isSubmitting = true;
    this.modalError = '';

    const dto: AdoptionRequestCreateDTO = {
      publicationId: this.publication.id
    };

    this.adoptionRequestService.createRequest(dto).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.onCloseModal(); // Cierra el modal de confirmación
        this.showSuccessModal = true; // <-- Muestra el nuevo modal de éxito
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (err.status === 400 && err.error?.message) {
          this.modalError = err.error.message; 
        } else {
          this.modalError = 'Error al enviar la solicitud. Inténtalo de nuevo.';
        }
      }
    });
  }


  onShare(): void {
    if (!this.publication) return;

    const shareUrl = window.location.href; // Obtiene la URL actual
    
    // Usamos la API del navegador para copiar al portapapeles
    navigator.clipboard.writeText(shareUrl).then(() => {
      
      // Si se copió con éxito, llamamos al servicio para registrarlo
      this.publicationService.sharePublication(this.publication!.id).subscribe({
        next: (response) => {
          if (response.status === 'success' && response.data) {
            // Actualizamos el contador local
            this.publication!.shared = response.data.shared; 
          }
        },
        error: (err) => {}
      });
      
      this.showShareModal = true;

    }).catch(err => {
      alert("No se pudo copiar el enlace. Intenta hacerlo manually.");
    });
  }

  /**
   * Cierra el modal de "Enlace Copiado".
   */
  onCloseShareModal(): void {
    this.showShareModal = false;
  }

  goBack(): void {
    this.location.back();
  }
  
  // Helpers para la UI
  getSpeciesLabel(species: Species): string {
    const labels: { [key in Species]: string } = {
      [Species.PERRO]: 'Perro',
      [Species.GATO]: 'Gato',
      [Species.AVE]: 'Ave',
      [Species.CONEJO]: 'Conejo',
      [Species.OTRO]: 'Otro'
    };
    return labels[species] || species;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/img/pet-placeholder.png'; 
  }
}