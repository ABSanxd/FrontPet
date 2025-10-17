import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { UserService } from '../../../../core/services/user/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UserCreateDTO } from '../../../../models/user';
import { Subscription } from 'rxjs';
import { UbigeoService } from '../../../../services/ubigeo/ubigeo.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements AfterViewInit, OnDestroy {
  name = '';
  email = '';
  password = '';
  error = '';
  // nuevos campos
  department = '';
  province = '';
  district = '';
  birthDate: string | null = null;
  // listas para selects
  departments: string[] = [];
  provinces: string[] = [];
  districts: string[] = [];

  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private ubigeoService: UbigeoService,
    private router: Router
  ) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }


  ngAfterViewInit() {
    if (this.isBrowser()) {
      const registerModal = document.getElementById('registerModal');
      if (registerModal) {
        registerModal.addEventListener('hidden.bs.modal', () => this.clearForm());
      }
    }
    this.loadDepartments();

  }

  loadDepartments() {
    const s = this.ubigeoService.getDepartments().subscribe({
      next: list => this.departments = list,
      error: () => this.departments = []
    });
    this.subs.push(s);
  }

  onDepartmentChange() {
    this.province = '';
    this.district = '';
    this.provinces = [];
    this.districts = [];

    if (!this.department) return;

    const s = this.ubigeoService.getProvinces(this.department).subscribe({
      next: list => this.provinces = list,
      error: () => this.provinces = []
    });
    this.subs.push(s);
  }

  onProvinceChange() {
    this.district = '';
    this.districts = [];

    if (!this.department || !this.province) return;

    const s = this.ubigeoService.getDistricts(this.department, this.province).subscribe({
      next: list => this.districts = list,
      error: () => this.districts = []
    });
    this.subs.push(s);
  }


  onSubmit() {
    // Si tu backend requiere esos campos como obligatorios, valida acá antes de enviar
    const newUser: UserCreateDTO = {
      name: this.name,
      email: this.email,
      password: this.password,
      department: this.department || undefined,
      province: this.province || undefined,
      district: this.district || undefined,
      birthDate: this.birthDate ? this.birthDate.toString() : undefined
    };

    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.closeModal();

        this.authService.login(this.email, this.password).subscribe(() => {
          this.router.navigate(['/inicio']);
          this.clearForm();

        });
      },
      error: (err) => {
        const data = err.error?.data;
        if (data && typeof data === 'object') {
          this.error = String(Object.values(data)[0]);
        } else {
          this.error = err.error?.message || 'Error desconocido';
        }
      }
    });
  }

  clearForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.department = '';
    this.province = '';
    this.district = '';
    this.birthDate = '';
    this.error = '';
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

  todayMinus9Years(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 9); // restamos 9 años
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
