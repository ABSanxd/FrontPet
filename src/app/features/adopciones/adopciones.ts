import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PublicationService } from './publication.service';
import { Publication, AdoptionRequest } from '../../models/publication';
import { Species } from '../../models/enums/species.enum';
import { Status } from '../../models/enums/status.enum';
import { AdoptionRequestService } from './adoption-request.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-adopciones',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './adopciones.html',
  styleUrl: './adopciones.css'
})
export class Adopciones implements OnInit {
  activeTab: string = 'disponibles'; 
  loading: boolean = false; 
  loadingAvailable: boolean = false; 
  loadingRequests = false;
  
  availablePublications: Publication[] = []; 

  // Listas de Mis Publicaciones
  activePublications: Publication[] = [];
  pausedPublications: Publication[] = [];
  pendingPublications: Publication[] = [];
  adoptedPublications: Publication[] = [];
  deletedPublications: Publication[] = [];

  currentUserId: string | null = null;
  
  // Listas para Mis Solicitudes
  pendingReceivedRequests: AdoptionRequest[] = []; // Solicitudes recibidas
  sentRequests: AdoptionRequest[] = []; // Solicitudes enviadas
  acceptedRequests: AdoptionRequest[] = []; // Solicitudes aceptadas

  // Estado para los modales de Aceptar/Rechazar/Cancelar
  showAcceptModal = false;
  requestToAccept: AdoptionRequest | null = null;
  
  showRejectModal = false;
  requestToReject: AdoptionRequest | null = null;
  
  showCancelModal = false; // Para el modal de Cancelar
  requestToCancel: AdoptionRequest | null = null;

  modalError = ''; // Error para los modales de solicitud
  isModalLoading = false; 


  
  showDeleteConfirmModal = false;
  publicationToDelete: Publication | null = null; 
  
  showPauseConfirmModal = false;
  publicationToPauseId: string | null = null;

  showActivateConfirmModal = false;
  publicationToActivateId: string | null = null;
  
  constructor(
    private publicationService: PublicationService,
    private adoptionRequestService: AdoptionRequestService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUserId = this.authService.getUser()?.id || null;
  }

  ngOnInit(): void {
    this.loadAvailablePublications();
    this.loadPublications();
    this.loadAdoptionRequests();
  }

  loadAvailablePublications(): void {
    this.loadingAvailable = true;
    this.publicationService.getAvailablePublications().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.availablePublications = response.data;
        } else {
          this.availablePublications = [];
        }
        this.loadingAvailable = false;
      },
      error: (error) => {
        this.loadingAvailable = false;
      }
    });
  }

  loadPublications(): void {
    this.loading = true;
    this.publicationService.getAllPublications().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.filterPublications(response.data);
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        alert('Error al cargar tus publicaciones: ' + error.message);
      }
    });
  }

  loadAdoptionRequests(): void {
    this.loadingRequests = true;
    
    // Cargamos ambas listas en paralelo
    forkJoin({
      received: this.adoptionRequestService.getReceivedRequests(),
      sent: this.adoptionRequestService.getSentRequests()
    }).subscribe({
      next: ({ received, sent }) => {
        this.filterAdoptionRequests(received, sent);
        this.loadingRequests = false;
      },
      error: (err) => {
        this.loadingRequests = false;
        alert("No se pudieron cargar tus solicitudes.");
      }
    });
  }

  filterAdoptionRequests(received: AdoptionRequest[], sent: AdoptionRequest[]): void {
    // Solicitudes recibidas
    this.pendingReceivedRequests = received.filter(req => req.status === Status.PENDIENTE);
    
    // Solicitudes enviadas
    this.sentRequests = sent.filter(req => req.status !== Status.ACEPTADO);

    // Solicitudes aceptadas
    const acceptedReceived = received.filter(req => req.status === Status.ACEPTADO);
    const acceptedSent = sent.filter(req => req.status === Status.ACEPTADO);
    this.acceptedRequests = [...acceptedReceived, ...acceptedSent];
  }


  // Abrir modal ACEPTAR
  onAccept(request: AdoptionRequest): void {
    this.modalError = '';
    this.requestToAccept = request;
    this.showAcceptModal = true;
  }

  // Abrir modal RECHAZAR
  onReject(request: AdoptionRequest): void {
    this.modalError = '';
    this.requestToReject = request;
    this.showRejectModal = true;
  }

  // Abrir modal CANCELAR (solicitud enviada)
  onCancel(request: AdoptionRequest): void {
    this.modalError = '';
    this.requestToCancel = request;
    this.showCancelModal = true;
  }

  closeModals(): void {
    this.showAcceptModal = false;
    this.requestToAccept = null;
    this.showRejectModal = false;
    this.requestToReject = null;
    this.showCancelModal = false;
    this.requestToCancel = null;
    this.modalError = '';
    this.isModalLoading = false;
  }

  confirmAccept(): void {
    if (!this.requestToAccept) return;
    this.isModalLoading = true;
    this.modalError = '';
    
    this.adoptionRequestService.acceptRequest(this.requestToAccept.id).subscribe({
      next: () => {
        this.loadAdoptionRequests(); // Recargamos las listas
        this.closeModals();
        this.loadAvailablePublications();
        this.loadPublications();
      },
      error: (err) => {
        this.modalError = err.error?.message || "Error al aceptar la solicitud.";
        this.isModalLoading = false;
      }
    });
  }

  confirmReject(): void {
    if (!this.requestToReject) return;
    this.isModalLoading = true; 
    this.modalError = '';

    this.adoptionRequestService.rejectRequest(this.requestToReject.id).subscribe({
      next: () => {
        this.loadAdoptionRequests(); // Recargamos las listas
        this.closeModals();
      },
      error: (err) => {
        this.modalError = err.error?.message || "Error al rechazar la solicitud.";
        this.isModalLoading = false; 
      }
    });
  }

  confirmCancel(): void {
    if (!this.requestToCancel) return;
    this.isModalLoading = true; 
    this.modalError = '';

    this.adoptionRequestService.cancelRequest(this.requestToCancel.id).subscribe({
      next: () => {
        this.loadAdoptionRequests(); // Recargamos las listas
        this.closeModals();
      },
      error: (err) => {
        this.modalError = err.error?.message || "Error al cancelar la solicitud.";
        this.isModalLoading = false; 
      }
    });
  }


  onLike(event: MouseEvent, pub: Publication): void {
    event.stopPropagation(); // Evita que se haga clic en la tarjeta
    const button = event.currentTarget as HTMLButtonElement;
    button.disabled = true; // Deshabilita temporalmente

    // Actualización Optimista
    const originalLikedByMe = pub.likedByMe;
    const originalLikes = pub.likes;

    if (pub.likedByMe) {
      // Si ya le dio like -> UNLIKE
      pub.likes--;
      pub.likedByMe = false;
    } else {
      // Si no le ha dado like -> LIKE
      pub.likes++;
      pub.likedByMe = true;
    }

    // Llamada al servicio
    this.publicationService.toggleLike(pub.id).subscribe({
      next: (response) => {
        // Sincronización con el servidor
        if (response.status === 'success' && response.data) {
          pub.likes = response.data.likes;
          pub.likedByMe = response.data.likedByMe;
        } else {
          // Si la respuesta no es exitosa, revertimos
          pub.likes = originalLikes;
          pub.likedByMe = originalLikedByMe;
        }
        button.disabled = false; // Rehabilita
      },
      error: (err) => {
        // Rollback en caso de error HTTP
        // Revertimos la actualización optimista
        pub.likes = originalLikes;
        pub.likedByMe = originalLikedByMe;
        button.disabled = false; // Rehabilita
      }
    });
  }


  filterPublications(publications: Publication[]): void {
    this.activePublications = publications.filter(pub => pub.status === Status.ACTIVO);
    this.pausedPublications = publications.filter(pub => pub.status === Status.PAUSADO);
    this.pendingPublications = publications.filter(pub => pub.status === Status.PENDIENTE);
    this.adoptedPublications = publications.filter(pub => pub.status === Status.ADOPTADO);
    this.deletedPublications = publications.filter(pub => pub.status === Status.ELIMINADO);
  }

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

  editPublication(publication: Publication): void {
    this.router.navigate(['/publicaciones/editar', publication.id]);
  }

  pausePublication(id: string): void {
    this.publicationToPauseId = id;
    this.showPauseConfirmModal = true;
  }

  activatePublication(id: string): void {
    this.publicationToActivateId = id;
    this.showActivateConfirmModal = true;
  }

  deletePublication(pub: Publication): void {
    this.publicationToDelete = pub;
    this.showDeleteConfirmModal = true;
  }

  createNewPublication(): void {
    this.router.navigate(['/publicaciones/crear']);
  }

  confirmPause(): void {
    if (!this.publicationToPauseId) return;
    this.loading = true;
    this.publicationService.changeStatus(this.publicationToPauseId, Status.PAUSADO).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadPublications();
        }
        this.loading = false;
        this.closePauseConfirmModal(); 
      },
      error: (error) => {
        this.loading = false;
        alert('Error al pausar la publicación');
        this.closePauseConfirmModal();
      }
    });
  }

  confirmActivate(): void {
    if (!this.publicationToActivateId) return;
    this.loading = true;
    this.publicationService.changeStatus(this.publicationToActivateId, Status.ACTIVO).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadPublications();
        }
        this.loading = false;
        this.closeActivateConfirmModal();
      },
      error: (error) => {
        this.loading = false;
        alert('Error al activar la publicación');
        this.closeActivateConfirmModal();
      }
    });
  }

  confirmDelete(): void {
    if (!this.publicationToDelete) return;
    this.loading = true;
    this.publicationService.deletePublication(this.publicationToDelete.id).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.loadPublications();
        }
        this.loading = false;
        this.closeDeleteConfirmModal();
      },
      error: (error) => {
        this.loading = false;
        alert('Error al eliminar la publicación');
        this.closeDeleteConfirmModal();
      }
    });
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.publicationToDelete = null;
  }
  
  closePauseConfirmModal(): void {
    this.showPauseConfirmModal = false;
    this.publicationToPauseId = null;
  }
  
  closeActivateConfirmModal(): void {
    this.showActivateConfirmModal = false;
    this.publicationToActivateId = null;
  }
}