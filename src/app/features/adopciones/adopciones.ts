import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PublicationService } from './publication.service';
import { Publication } from '../../models/publication';
import { Species } from '../../models/enums/species.enum';
import { Status } from '../../models/enums/status.enum';

@Component({
  selector: 'app-adopciones',
  imports: [CommonModule],
  templateUrl: './adopciones.html',
  styleUrl: './adopciones.css'
})
export class Adopciones implements OnInit {
  activeTab: string = 'publicaciones';
  loading: boolean = false;
  
  // Listas de publicaciones separadas por estado
  activePublications: Publication[] = [];
  pausedPublications: Publication[] = [];
  pendingPublications: Publication[] = [];
  adoptedPublications: Publication[] = [];
  deletedPublications: Publication[] = [];
  
  constructor(
    private publicationService: PublicationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Componente Adopciones inicializado');
    this.loadPublications();
  }

  // Cargar todas las publicaciones y filtrarlas por estado
  loadPublications(): void {
    console.log('Iniciando carga de publicaciones...');
    this.loading = true;
    this.publicationService.getAllPublications().subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
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
        console.error('Detalles del error:', error.message);
        console.error('Status:', error.status);
        this.loading = false;
        alert('Error al cargar las publicaciones: ' + error.message);
      }
    });
  }

  // Filtrar publicaciones según su estado
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

  // Obtener etiqueta legible de la especie
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

  // Obtener emoji de la especie
  getSpeciesEmoji(species: Species): string {
    const emojis: { [key in Species]: string } = {
      [Species.PERRO]: '🐶',
      [Species.GATO]: '🐱',
      [Species.AVE]: '🐦',
      [Species.CONEJO]: '🐰',
      [Species.OTRO]: '🦊'
    };
    return emojis[species] || '🐾';
  }

  // Editar publicación
  editPublication(publication: Publication): void {
    // Navegar a página de edición con el ID
    this.router.navigate(['/publicaciones/editar', publication.id]);
  }

  // Pausar publicación
  pausePublication(id: number): void {
    if (confirm('¿Estás seguro de pausar esta publicación?')) {
      this.loading = true;
      this.publicationService.changeStatus(id, Status.PAUSADO).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadPublications();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al pausar publicación:', error);
          this.loading = false;
          alert('Error al pausar la publicación');
        }
      });
    }
  }

  // Activar publicación
  activatePublication(id: number): void {
    if (confirm('¿Estás seguro de activar esta publicación?')) {
      this.loading = true;
      this.publicationService.changeStatus(id, Status.ACTIVO).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadPublications();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al activar publicación:', error);
          this.loading = false;
          alert('Error al activar la publicación');
        }
      });
    }
  }

  // Eliminar publicación
  deletePublication(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta publicación? Esta acción no se puede deshacer.')) {
      this.loading = true;
      this.publicationService.deletePublication(id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.loadPublications();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al eliminar publicación:', error);
          this.loading = false;
          alert('Error al eliminar la publicación');
        }
      });
    }
  }

  // Crear nueva publicación
  createNewPublication(): void {
    this.router.navigate(['/publicaciones/crear']);
  }
}