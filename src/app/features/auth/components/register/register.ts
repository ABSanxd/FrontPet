import { AfterViewInit, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UbigeoService } from '../../../../services/ubigeo/ubigeo.service';
import { UserCreateDTO } from '../../../../models/user';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VerifyModal } from '../verify-modal/verify-modal';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, VerifyModal],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit, AfterViewInit, OnDestroy {
  registerForm!: FormGroup;
  error = '';
  isLoading = false;
  formSubmitted = false;

  departments: string[] = [];
  provinces: string[] = [];
  districts: string[] = [];

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ubigeoService: UbigeoService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      department: ['', Validators.required],
      province: [{ value: '', disabled: true }],
      district: [{ value: '', disabled: true }],
      birthDate: ['']
    });
    this.loadDepartments();
  }

  ngAfterViewInit() {
    if (!this.isBrowser()) return;
    const modal = document.getElementById('registerModal');
    if (modal) modal.addEventListener('hidden.bs.modal', () => this.clearForm());
  }

  get f() {
    return this.registerForm.controls;
  }

  onDepartmentChange() {
    const dept = this.f['department'].value;
    if (!dept) {
      this.provinces = [];
      this.districts = [];
      this.f['province'].disable();
      this.f['district'].disable();
      return;
    }

    this.provinces = [];
    this.districts = [];
    this.f['province'].enable();

    const s = this.ubigeoService.getProvinces(dept).subscribe({
      next: list => this.provinces = list,
      error: () => this.provinces = []
    });
    this.subs.push(s);
  }

  onProvinceChange() {
    const dept = this.f['department'].value;
    const prov = this.f['province'].value;
    if (!dept || !prov) {
      this.districts = [];
      this.f['district'].disable();
      return;
    }

    this.districts = [];
    this.f['district'].enable();

    const s = this.ubigeoService.getDistricts(dept, prov).subscribe({
      next: list => this.districts = list,
      error: () => this.districts = []
    });
    this.subs.push(s);
  }

  onSubmit() {
    this.formSubmitted = true;
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.error = 'Por favor completa los campos correctamente.';
      return;
    }

    this.isLoading = true;
    const newUser: UserCreateDTO = this.registerForm.value;

    this.authService.register(newUser).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeModal();
        this.openVerifyModal(newUser.email);
      },
      error: (err) => {
        this.isLoading = false;
        const data = err.error?.data;
        this.error = data && typeof data === 'object'
          ? String(Object.values(data)[0])
          : err.error?.message || 'Error desconocido';
      }
    });
  }

  private openVerifyModal(email: string) {
    const modalEl = document.getElementById('verifyModal');
    if (modalEl) {
      modalEl.classList.add('show');
      modalEl.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  onVerified() {
    this.authService.login(
      this.registerForm.value.email,
      this.registerForm.value.password
    ).subscribe(() => {
      this.router.navigate(['/inicio']);
      this.clearForm();
    });
  }

  private resetUbigeos() {
    this.provinces = [];
    this.districts = [];
    this.f['province'].setValue('');
    this.f['district'].setValue('');
    this.f['province'].disable();
    this.f['district'].disable();
  }

  clearForm() {
    this.registerForm.reset();
    this.error = '';
    this.formSubmitted = false;
    this.resetUbigeos();
  }


  private closeModal() {
    if (!this.isBrowser()) return;
    const modalEl = document.getElementById('registerModal');
    if (modalEl) {
      modalEl.classList.remove('show');
      modalEl.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }

  loadDepartments() {
    const s = this.ubigeoService.getDepartments().subscribe({
      next: list => this.departments = list,
      error: () => this.departments = []
    });
    this.subs.push(s);
  }

  todayMinus9Years(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 9);
    return d.toISOString().split('T')[0];
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
