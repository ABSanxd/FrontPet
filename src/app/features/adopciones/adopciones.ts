import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // <--- Añadir DatePipe
import { Router, RouterLink } from '@angular/router';
import { PublicationService } from './publication.service';
import { Publication, AdoptionRequest } from '../../models/publication'; // <--- Añadir AdoptionRequest
import { Species } from '../../models/enums/species.enum';
import { Status } from '../../models/enums/status.enum';
import { AdoptionRequestService } from './adoption-request.service'; // <--- AÑADIR NUEVO SERVICIO
import { AuthService } from '../../core/services/auth/auth.service'; // <--- AÑADIR AUTHSERVICE
import { forkJoin } from 'rxjs'; // <--- AÑADIR forkJoin

@Component({
  selector: 'app-adopciones',
  imports: [CommonModule, RouterLink, DatePipe], // <--- Añadir DatePipe
  templateUrl: './adopciones.html',
  styleUrl: './adopciones.css'
})
export class Adopciones implements OnInit {
  activeTab: string = 'disponibles'; 
  loading: boolean = false; 
  loadingAvailable: boolean = false; 
  loadingRequests = false; // <--- Loader para "Mis Solicitudes"
  
  availablePublications: Publication[] = []; 

  // Listas de "Mis Publicaciones"
  activePublications: Publication[] = [];
  pausedPublications: Publication[] = [];
  pendingPublications: Publication[] = [];
  adoptedPublications: Publication[] = [];
  deletedPublications: Publication[] = [];

  // --- INICIO: Lógica "Mis Solicitudes" ---
  currentUserId: string | null = null;
  
  // Listas para "Mis Solicitudes"
  pendingReceivedRequests: AdoptionRequest[] = []; // "Solicitudes recibidas" (Pendientes)
  sentRequests: AdoptionRequest[] = []; // "Solicitudes enviadas" (Pendientes, Rechazadas, Canceladas)
  acceptedRequests: AdoptionRequest[] = []; // "Solicitudes aceptadas" (Aceptadas)

  // Estado para los modales de Aceptar/Rechazar/Cancelar
  showAcceptModal = false;
  requestToAccept: AdoptionRequest | null = null;
  
  showRejectModal = false;
  requestToReject: AdoptionRequest | null = null;
  
  showCancelModal = false; // Para el modal de "Cancelar" (enviadas)
  requestToCancel: AdoptionRequest | null = null;

  modalError = ''; // Error para los modales de solicitud
  // --- FIN: Lógica "Mis Solicitudes" ---

  
  showDeleteConfirmModal = false;
  publicationToDelete: Publication | null = null; 
  
  showPauseConfirmModal = false;
  publicationToPauseId: string | null = null;

  showActivateConfirmModal = false;
  publicationToActivateId: string | null = null;
  
  constructor(
    private publicationService: PublicationService,
    private adoptionRequestService: AdoptionRequestService, // <--- INYECTAR
    private authService: AuthService, // <--- INYECTAR
    private router: Router
  ) {
    this.currentUserId = this.authService.getUser()?.id || null;
  }

  ngOnInit(): void {
    console.log('Componente Adopciones inicializado');
    this.loadAvailablePublications(); 
    this.loadPublications(); 
    this.loadAdoptionRequests(); // <--- Cargar solicitudes
  }

  loadAvailablePublications(): void {
    console.log('Iniciando carga de MASCOTAS DISPONIBLES...');
    this.loadingAvailable = true;
    this.publicationService.getAvailablePublications().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.availablePublications = response.data;
          console.log('Mascotas Disponibles cargadas:', this.availablePublications.length);
        } else {
          this.availablePublications = [];
        }
        this.loadingAvailable = false;
      },
      error: (error) => {
        console.error('Error al cargar publicaciones disponibles:', error);
        this.loadingAvailable = false;
      }
    });
  }

  loadPublications(): void {
    console.log('Iniciando carga de MIS PUBLICACIONES...');
    this.loading = true;
    this.publicationService.getAllPublications().subscribe({ 
      next: (response) => {
        console.log('Respuesta de "Mis Publicaciones":', response);
        if (response.status === 'success' && response.data) {
          console.log('Publicaciones recibidas:', response.data);
          this.filterPublications(response.data);
        } else {
          console.warn('Respuesta sin datos o no exitosa');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar publicaciones:', error);
        this.loading = false;
        alert('Error al cargar tus publicaciones: ' + error.message);
      }
    });
  }

  // --- AÑADIR ESTOS MÉTODOS PARA "MIS SOLICITUDES" ---

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
        console.error("Error cargando solicitudes", err);
        this.loadingRequests = false;
        alert("No se pudieron cargar tus solicitudes.");
      }
    });
  }

  filterAdoptionRequests(received: AdoptionRequest[], sent: AdoptionRequest[]): void {
    // 1. "Solicitudes recibidas" (Solo las pendientes)
    this.pendingReceivedRequests = received.filter(req => req.status === Status.PENDIENTE);
    
    // 2. "Solicitudes enviadas" (Todo menos las Aceptadas)
    this.sentRequests = sent.filter(req => req.status !== Status.ACEPTADO);

    // 3. "Solicitudes aceptadas" (Tanto recibidas como enviadas que estén ACEPTADAS)
    const acceptedReceived = received.filter(req => req.status === Status.ACEPTADO);
    const acceptedSent = sent.filter(req => req.status === Status.ACEPTADO);
    this.acceptedRequests = [...acceptedReceived, ...acceptedSent];
  }

  // --- Manejadores de Modales (Aceptar, Rechazar, Cancelar) ---

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
  }

  // --- Acciones de Confirmación (llaman al backend) ---

  confirmAccept(): void {
    if (!this.requestToAccept) return;
    this.loadingRequests = true; // Usamos el loader general de la pestaña
    
    this.adoptionRequestService.acceptRequest(this.requestToAccept.id).subscribe({
      next: () => {
        this.loadAdoptionRequests(); // Recargamos las listas
        this.closeModals();
        // ¡Importante! Recargamos también las publicaciones,
        // porque la mascota aceptada ahora está "ADOPTADO".
        this.loadAvailablePublications(); 
        this.loadPublications();
      },
      error: (err) => {
        this.modalError = err.error?.message || "Error al aceptar la solicitud.";
        this.loadingRequests = false;
      }
    });
  }

  confirmReject(): void {
    if (!this.requestToReject) return;
    this.loadingRequests = true;

    this.adoptionRequestService.rejectRequest(this.requestToReject.id).subscribe({
      next: () => {
        this.loadAdoptionRequests(); // Recargamos las listas
        this.closeModals();
      },
      error: (err) => {
        this.modalError = err.error?.message || "Error al rechazar la solicitud.";
        this.loadingRequests = false;
      }
    });
  }

  confirmCancel(): void {
    if (!this.requestToCancel) return;
    this.loadingRequests = true;

    this.adoptionRequestService.cancelRequest(this.requestToCancel.id).subscribe({
      next: () => {
        this.loadAdoptionRequests(); // Recargamos las listas
        this.closeModals();
      },
      error: (err) => {
        this.modalError = err.error?.message || "Error al cancelar la solicitud.";
        this.loadingRequests = false;
      }
    });
  }

  // --- FIN MÉTODOS "MIS SOLICITUDES" ---

  /**
   * Maneja el clic en el botón "Like" (toggle).
   * Actualiza la UI "optimistamente" y luego llama al servicio.
   */
  onLike(event: MouseEvent, pub: Publication): void {
    event.stopPropagation(); // Evita que se haga clic en la tarjeta
    const button = event.currentTarget as HTMLButtonElement;
    button.disabled = true; // Deshabilita temporalmente

    // 1. Actualización Optimista (UI responde al instante)
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

    // 2. Llamada al servicio
    this.publicationService.toggleLike(pub.id).subscribe({
      next: (response) => {
        // 3. Sincronización con el servidor (sobrescribe por si acaso)
        // *** ESTA ES LA CORRECCIÓN PARA EL ERROR DE TYPESCRIPT ***
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
        // 4. Rollback en caso de error HTTP
        console.error("Error al dar like:", err);
        // Revertimos la actualización optimista
        pub.likes = originalLikes;
        pub.likedByMe = originalLikedByMe;
        button.disabled = false; // Rehabilita
      }
    });
  }


  filterPublications(publications: Publication[]): void {
    console.log('=== FILTRANDO PUBLICACIONES ===');
    console.log('Total recibidas:', publications.length);
    console.log('Primera publicación:', publications[0]);
    console.log('Status de la primera:', publications[0]?.status);
    console.log('Comparando con Status.PENDIENTE:', Status.PENDIENTE);
    console.log('¿Son iguales?', publications[0]?.status === Status.PENDIENTE);
    
    this.activePublications = publications.filter(pub => pub.status === Status.ACTIVO);
    this.pausedPublications = publications.filter(pub => pub.status === Status.PAUSADO);
    this.pendingPublications = publications.filter(pub => pub.status === Status.PENDIENTE);
    this.adoptedPublications = publications.filter(pub => pub.status === Status.ADOPTADO);
    this.deletedPublications = publications.filter(pub => pub.status === Status.ELIMINADO);
    
    console.log('Activas:', this.activePublications.length);
    console.log('Pausadas:', this.pausedPublications.length);
    console.log('Pendientes:', this.pendingPublications.length);
    console.log('Adoptadas:', this.adoptedPublications.length);
    console.log('Eliminadas:', this.deletedPublications.length);
    console.log('=== FIN FILTRADO ===');
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
        console.error('Error al pausar publicación:', error);
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
        console.error('Error al activar publicación:', error);
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
        console.error('Error al eliminar publicación:', error);
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