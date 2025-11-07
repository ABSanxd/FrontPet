import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, startWith, switchMap } from 'rxjs';
import { UbigeoService } from '../../../services/ubigeo/ubigeo.service';
@Component({
  selector: 'app-perfil-location-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-location-form.html',
  styleUrl: './perfil-location-form.css',
})
export class PerfilLocationForm implements OnInit {
  @Input() profileForm!: FormGroup;
  @Input() isEditing: boolean = false

  public departments$!: Observable<string[]>;
  public provinces$!: Observable<string[]>;
  public districts$!: Observable<string[]>;

  constructor(private ubigeoService: UbigeoService) { }

  ngOnInit(): void {
    this.setupUbigeoListeners();
  }

  setupUbigeoListeners(): void {
    this.departments$ = this.ubigeoService.getDepartments();

    const initialDepartment = this.profileForm.get('department')!.value;
    const initialProvince = this.profileForm.get('province')!.value;


    // Provincias
    this.provinces$ = this.profileForm.get('department')!.valueChanges.pipe(
      startWith(initialDepartment),
      switchMap((dep) => {
        if (dep !== initialDepartment) {
          this.profileForm.get('province')!.setValue('', { emitEvent: false });
          this.profileForm.get('district')!.setValue('', { emitEvent: false });
        } else if (dep && !this.profileForm.get('province')!.value) {
          // Aquí podrías cargar la provincia inicial si lo deseas
        }
        return dep ? this.ubigeoService.getProvinces(dep) : [];
      })
    );

    //cargar distrto
    this.districts$ = combineLatest([
      this.profileForm.get('department')!.valueChanges.pipe(startWith(initialDepartment)),
      this.profileForm.get('province')!.valueChanges.pipe(startWith(initialProvince)),
    ]).pipe(
      switchMap(([dep, prov]) => {
        if (dep === initialDepartment && prov === initialProvince) {
          // Es la carga inicial, no limpiamos nada
        } else if (prov !== initialProvince && prov !== '') {
          // Limpiamos el distrito si la provincia cambia (y no está vacío)
          this.profileForm.get('district')!.setValue('', { emitEvent: false });
        }
        return dep && prov ? this.ubigeoService.getDistricts(dep, prov) : [];
      })
    );
  }
}