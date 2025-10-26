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

  public departments$!: Observable<string[]>;
  public provinces$!: Observable<string[]>;
  public districts$!: Observable<string[]>;

  constructor(private ubigeoService: UbigeoService) {}

  ngOnInit(): void {
    this.setupUbigeoListeners();
  }

  setupUbigeoListeners(): void {
    this.departments$ = this.ubigeoService.getDepartments();

    this.provinces$ = this.profileForm.get('department')!.valueChanges.pipe(
      startWith(this.profileForm.get('department')!.value),
      switchMap((dep) => {
        this.profileForm.get('province')!.setValue('');
        this.profileForm.get('district')!.setValue('');
        return dep ? this.ubigeoService.getProvinces(dep) : [];
      })
    );

    this.districts$ = combineLatest([
      this.profileForm
        .get('department')!
        .valueChanges.pipe(startWith(this.profileForm.get('department')!.value)),
      this.profileForm
        .get('province')!
        .valueChanges.pipe(startWith(this.profileForm.get('province')!.value)),
    ]).pipe(
      switchMap(([dep, prov]) => {
        this.profileForm.get('district')!.setValue('');
        return dep && prov ? this.ubigeoService.getDistricts(dep, prov) : [];
      })
    );
  }
}
