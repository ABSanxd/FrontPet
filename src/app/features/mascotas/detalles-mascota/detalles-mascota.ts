import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetService } from '../service/pet.service';
import { PetResponseDTO } from '../../../models/pet';
import { PetLevel } from '../../../models/enums/pet-level.enum';
import { VaccineService } from '../service/vaccine.service';
import { VaccineResponseDTO } from '../../../models/vaccine';

@Component({
  selector: 'app-detalles-mascota',
  imports: [CommonModule, RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './detalles-mascota.html',
  styleUrl: './detalles-mascota.css'
})
export class DetallesMascota implements OnInit {

  pet: PetResponseDTO | null = null;
  isLoading = true;
  error = '';

  activeTab: 'retos' | 'logros' | 'vacunas' = 'retos'; 
  vaccines: VaccineResponseDTO[] = [];
  isLoadingVaccines = false;

  private levelXpThresholds: Record<PetLevel, number> = {
    [PetLevel.NOVATO]: 5000,
    [PetLevel.EXPLORADOR]: 10000,
    [PetLevel.CAZADOR]: 20000,
    [PetLevel.MAESTRO]: 50000,
    [PetLevel.ALFA]: Infinity 
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router,      
    private petService: PetService,
    private vaccineService: VaccineService
  ) { }

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('id');

    if (!petId) {
      this.error = 'No se encontró el ID de la mascota.';
      this.isLoading = false;
      return;
    }

    this.loadPetDetails(petId);
    this.loadVaccines(petId); 
  }

  loadPetDetails(id: string): void {
    this.isLoading = true;
    this.error = '';

    this.petService.getPetById(id).subscribe({
      next: (data) => {
        this.pet = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle de mascota:', err);
        this.error = 'No se pudo encontrar la mascota.';
        this.isLoading = false;
      }
    });
  }

  loadVaccines(petId: string): void {
    this.isLoadingVaccines = true;
    this.vaccineService.getVaccines(petId).subscribe({
      next: (data) => {
        this.vaccines = data;
        this.isLoadingVaccines = false;
      },
      error: (err) => {
        console.error('Error al cargar vacunas:', err);
        this.isLoadingVaccines = false;
      }
    });
  }
  
  getFirstApplicationDate(vaccine: VaccineResponseDTO): string | null {
    if (!vaccine.doses || vaccine.doses.length === 0) {
      return vaccine.createdAt; 
    }
    const firstDate = vaccine.doses.reduce((earliest, current) => {
      return new Date(current.applicationDate) < new Date(earliest.applicationDate) ? current : earliest;
    });
    return firstDate.applicationDate;
  }

  onAddVaccine(): void {
    if (!this.pet) return;
    this.router.navigate(['/mascotas', this.pet.id, 'vacunas', 'nueva']);
  }
  
  onEditVaccine(vaccineId: string): void {
     if (!this.pet) return;
     this.router.navigate(['/mascotas', this.pet.id, 'vacunas', vaccineId, 'editar']);
  }
  
  onDeleteVaccine(vaccineId: string): void {
    if (!this.pet) return;
    
    const vaccineName = this.vaccines.find(v => v.id === vaccineId)?.name || 'esta vacuna';
    
    if (confirm(`¿Estás seguro de eliminar el registro de ${vaccineName}?`)) {
      this.isLoadingVaccines = true;
      this.vaccineService.deleteVaccine(this.pet.id, vaccineId).subscribe({
        next: () => {
          this.loadVaccines(this.pet!.id); 
        },
        error: (err) => {
          console.error('Error al eliminar vacuna:', err);
          alert('No se pudo eliminar la vacuna.');
          this.isLoadingVaccines = false;
        }
      });
    }
  }

  getEdadFormateada(): string {
    if (!this.pet || (this.pet.ageYears === undefined && this.pet.ageMonths === undefined)) {
      return 'No especificada';
    }
    const years = this.pet.ageYears ?? 0;
    const months = this.pet.ageMonths ?? 0;
    if (years === 0 && months === 0) {
      return this.pet.birthDate ? 'Menos de 1 mes' : 'No especificada';
    }
    const yearText = years > 0 ? `${years} ${years === 1 ? 'año' : 'años'}` : '';
    const monthText = months > 0 ? `${months} ${months === 1 ? 'mes' : 'meses'}` : '';
    return [yearText, monthText].filter(Boolean).join(' y ');
  }

  getPetLevelImage(level: PetLevel): string {
     const images: Record<PetLevel, string> = {
      [PetLevel.NOVATO]: 'assets/img-level-bronce.png',
      [PetLevel.EXPLORADOR]: 'assets/img-level-plata.png',
      [PetLevel.CAZADOR]: 'assets/img-level-oro.png',
      [PetLevel.MAESTRO]: 'assets/img-level-maestro.png',
      [PetLevel.ALFA]: 'assets/img-level-alfa.png',
    };
    return images[level] || images[PetLevel.NOVATO];
  }

  getMaxXPForLevel(level: PetLevel): number {
    return this.levelXpThresholds[level] || 5000;
  }

  getPetXPPercentage(xp: number, level: PetLevel): number {
    const maxXP = this.getMaxXPForLevel(level);
    if (maxXP === Infinity) return 100;
    return (xp / maxXP) * 100;
  }
  
  onImageError(event: any): void {
    event.target.src = 'assets/img/pet-placeholder.png'; 
  }

  onDeletePet(): void {
    if (!this.pet) return;
    const wantsDelete = confirm(`¿Estás seguro de que quieres eliminar a ${this.pet.nombre}? Esta acción no se puede deshacer.`);
    if (wantsDelete) {
      this.isLoading = true; 
      this.petService.deletePet(this.pet.id).subscribe({
        next: () => {
          this.router.navigate(['/inicio']); 
        },
        error: (err) => {
          console.error('Error al eliminar mascota:', err);
          this.error = 'Error al eliminar la mascota.';
          this.isLoading = false;
        }
      });
    }
  }
}