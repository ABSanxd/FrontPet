import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VaccineService } from '../service/vaccine.service';
import { VaccineCreateDTO, VaccineDoseDTO, VaccineUpdateDTO } from '../../../models/vaccine'; 

@Component({
  selector: 'app-registrar-vacuna',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registrar-vacuna.html',
  styleUrl: './registrar-vacuna.css',
})
export class RegistrarVacuna implements OnInit {
  vaccineForm!: FormGroup;
  isLoading = false;
  isEditMode = false;
  error = '';

  petId: string | null = null;
  vaccineId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vaccineService: VaccineService
  ) {}

  ngOnInit(): void {
    this.petId = this.route.snapshot.paramMap.get('petId');
    this.vaccineId = this.route.snapshot.paramMap.get('vaccineId');
    this.isEditMode = !!this.vaccineId;

    if (!this.petId) {
      this.error = 'No se encontró el ID de la mascota.';
      return;
    }

    this.vaccineForm = this.fb.group({
      name: ['', Validators.required],
      doses: this.fb.array([]),
    });

    if (this.isEditMode && this.vaccineId) {
      this.loadVaccineData(this.petId, this.vaccineId);
    } else {
      
      if (this.doses.length === 0) {
        this.addDose();
      }
    }
  }


  loadVaccineData(petId: string, vaccineId: string): void {
    this.isLoading = true;
    this.vaccineService.getVaccineById(petId, vaccineId).subscribe({
      next: (vaccine) => {
        if (!vaccine) {
          this.error = 'No se encontró la vacuna para editar.';
          this.isLoading = false;
          return;
        }

        this.vaccineForm.patchValue({ name: vaccine.name });

        this.doses.clear();
        if (vaccine.doses && vaccine.doses.length > 0) {
          vaccine.doses.forEach((dose) => {
            this.doses.push(this.newDose(dose));
          });
        } else {
          this.addDose();
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la vacuna.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  get doses(): FormArray {
    return this.vaccineForm.get('doses') as FormArray;
  }

  newDose(dose?: VaccineDoseDTO): FormGroup {
    return this.fb.group({
      id: [dose?.id || null], 
      applicationDate: [
        dose?.applicationDate || '',
        Validators.required,
      ],
      applied: [dose?.applied || false],
    });
  }

  addDose(): void {
    this.doses.push(this.newDose());
  }

  removeDose(index: number): void {
    if (this.doses.length > 1) {
      this.doses.removeAt(index);
    } else {
      alert('Debe haber al menos una dosis programada.');
    }
  }

  onSubmit(): void {
    if (this.vaccineForm.invalid) {
      this.vaccineForm.markAllAsTouched();
      this.error = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    if (!this.petId) {
      this.error = 'Error: No se encontró el ID de la mascota.';
      return;
    }

    this.isLoading = true;
    this.error = '';

    if (this.isEditMode && this.vaccineId) {
      const dto: VaccineUpdateDTO = this.vaccineForm.value;
      
      this.vaccineService.updateVaccine(this.petId, this.vaccineId, dto).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/mascotas', this.petId]);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error?.message || 'Error al actualizar la vacuna.';
          console.error(err);
        }
      });

    } else {
      const rawFormValue = this.vaccineForm.value;
      const dto: VaccineCreateDTO = {
        name: rawFormValue.name,
        doses: rawFormValue.doses.map((dose: any) => ({
          applicationDate: dose.applicationDate,
          applied: dose.applied,
        })),
      };

      this.vaccineService.createVaccine(this.petId, dto).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/mascotas', this.petId]);
        },
        error: (err) => {
          this.isLoading = false;
          this.error =
            err.error?.message || 'Error al crear la vacuna. Intenta de nuevo.';
          console.error(err);
        },
      });
    }
  }
}