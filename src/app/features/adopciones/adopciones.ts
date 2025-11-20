import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common'; 
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

import { PublicationService } from './publication.service';
import { Publication, AdoptionRequest } from '../../models/publication';
import { Species } from '../../models/enums/species.enum';
import { Status } from '../../models/enums/status.enum';
import { AdoptionRequestService } from './adoption-request.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { UbigeoService } from '../../services/ubigeo/ubigeo.service'; 
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-adopciones',
  imports: [CommonModule, RouterLink, DatePipe, FormsModule, TitleCasePipe], 
  templateUrl: './adopciones.html',
  styleUrl: './adopciones.css'
})
export class Adopciones implements OnInit {
  activeTab: string = 'disponibles'; 
  
  loading: boolean = false; 
  loadingAvailable: boolean = false; 
  loadingRequests = false;
  
  allAvailablePublications: Publication[] = []; // Copia original completa
  availablePublications: Publication[] = [];    // Lista filtrada que se ve en pantalla

  // Campos del filtro
  searchText: string = '';
  selectedSpecies: string = '';
  selectedDepartment: string = '';
  selectedProvince: string = '';
  selectedDistrict: string = '';

  // Listas para los selects
  speciesList = Object.values(Species);
  departments: string[] = [];
  provinces: string[] = [];
  districts: string[] = [];

  // Listas de Mis Publicaciones
  activePublications: Publication[] = [];
  pausedPublications: Publication[] = [];
  pendingPublications: Publication[] = [];
  adoptedPublications: Publication[] = [];
  deletedPublications: Publication[] = [];

  currentUserId: string | null = null;
  
  // Listas para Mis Solicitudes
  pendingReceivedRequests: AdoptionRequest[] = [];
  sentRequests: AdoptionRequest[] = []; 
  acceptedRequests: AdoptionRequest[] = [];

  // Modales
  showAcceptModal = false;
  requestToAccept: AdoptionRequest | null = null;
  showRejectModal = false;
  requestToReject: AdoptionRequest | null = null;
  showCancelModal = false;
  requestToCancel: AdoptionRequest | null = null;
  modalError = '';
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
    private ubigeoService: UbigeoService, // <--- Inyectado
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUserId = this.authService.getUser()?.id || null;
  }

  ngOnInit(): void {
    this.loadAvailablePublications();
    this.loadPublications();
    this.loadAdoptionRequests();
    this.loadDepartments(); // Cargar departamentos al inicio
  }

  // FILTROS Y UBIGEO

  loadDepartments(): void {
    this.ubigeoService.getDepartments().subscribe({
      next: (deps) => this.departments = deps,
      error: () => console.error('Error al cargar departamentos')
    });
  }

  onDepartmentChange(): void {
    this.selectedProvince = '';
    this.selectedDistrict = '';
    this.provinces = [];
    this.districts = [];
    this.applyFilters(); // Aplicar filtro al cambiar

    if (this.selectedDepartment) {
      this.ubigeoService.getProvinces(this.selectedDepartment).subscribe(provs => {
        this.provinces = provs;
      });
    }
  }

  onProvinceChange(): void {
    this.selectedDistrict = '';
    this.districts = [];
    this.applyFilters(); 

    if (this.selectedDepartment && this.selectedProvince) {
      this.ubigeoService.getDistricts(this.selectedDepartment, this.selectedProvince).subscribe(dists => {
        this.districts = dists;
      });
    }
  }

  // Función principal de filtrado
  applyFilters(): void {
    this.availablePublications = this.allAvailablePublications.filter(pub => {
      // Filtro de Nombre
      const matchText = !this.searchText ||
                        pub.tempName.toLowerCase().includes(this.searchText.toLowerCase());

      // Filtro Especie
      const matchSpecies = !this.selectedSpecies ||
                           pub.species === this.selectedSpecies;

      // Filtros Ubicación 
      const matchDep = !this.selectedDepartment || pub.department === this.selectedDepartment;
      const matchProv = !this.selectedProvince || pub.province === this.selectedProvince;
      const matchDist = !this.selectedDistrict || pub.district === this.selectedDistrict;

      return matchText && matchSpecies && matchDep && matchProv && matchDist;
    });
  }
  
  // Método para limpiar filtros
  clearFilters(): void {
    this.searchText = '';
    this.selectedSpecies = '';
    this.selectedDepartment = '';
    this.onDepartmentChange(); // Esto limpia prov/dist y reaplica filtros
  }

  loadAvailablePublications(): void {
    this.loadingAvailable = true;
    this.publicationService.getAvailablePublications().subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          // Guardamos en AMBAS listas
          this.allAvailablePublications = response.data;
          this.availablePublications = response.data;
          // Aplicamos filtros por si había alguno seleccionado
          this.applyFilters();
        } else {
          this.allAvailablePublications = [];
          this.availablePublications = [];
        }
        this.loadingAvailable = false;
      },
      error: (error) => {
        this.loadingAvailable = false;
        this.allAvailablePublications = [];
        this.availablePublications = [];
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
    this.pendingReceivedRequests = received.filter(req => req.status === Status.PENDIENTE);
    this.sentRequests = sent.filter(req => req.status !== Status.ACEPTADO);
    const acceptedReceived = received.filter(req => req.status === Status.ACEPTADO);
    const acceptedSent = sent.filter(req => req.status === Status.ACEPTADO);
    this.acceptedRequests = [...acceptedReceived, ...acceptedSent];
  }

  onAccept(request: AdoptionRequest): void {
    this.modalError = '';
    this.requestToAccept = request;
    this.showAcceptModal = true;
  }

  onReject(request: AdoptionRequest): void {
    this.modalError = '';
    this.requestToReject = request;
    this.showRejectModal = true;
  }

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
        this.loadAdoptionRequests(); 
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
        this.loadAdoptionRequests();
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
        this.loadAdoptionRequests();
        this.closeModals();
      },
      error: (err) => {
        this.modalError = err.error?.message || "Error al cancelar la solicitud.";
        this.isModalLoading = false; 
      }
    });
  }

  onLike(event: MouseEvent, pub: Publication): void {
    event.stopPropagation();
    const button = event.currentTarget as HTMLButtonElement;
    button.disabled = true;

    const originalLikedByMe = pub.likedByMe;
    const originalLikes = pub.likes;

    if (pub.likedByMe) {
      pub.likes--;
      pub.likedByMe = false;
    } else {
      pub.likes++;
      pub.likedByMe = true;
    }

    this.publicationService.toggleLike(pub.id).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          pub.likes = response.data.likes;
          pub.likedByMe = response.data.likedByMe;
        } else {
          pub.likes = originalLikes;
          pub.likedByMe = originalLikedByMe;
        }
        button.disabled = false;
      },
      error: (err) => {
        pub.likes = originalLikes;
        pub.likedByMe = originalLikedByMe;
        button.disabled = false;
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