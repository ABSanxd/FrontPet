import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { UserResponseDTO, UserUpdateDTO } from '../../models/user';
import { BehaviorSubject } from 'rxjs';

import { PerfilPasswordChange } from './perfil-password-change/perfil-password-change';
import { PerfilLocationForm } from './perfil-location-form/perfil-location-form';
import { PerfilInfoCard } from './perfil-info-card/perfil-info-card';
import { PerfilPetsInfo } from './perfil-pets-info/perfil-pets-info';
import { PerfilDeleteModal } from './perfil-delete-modal/perfil-delete-modal';
@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    PerfilInfoCard,
    PerfilLocationForm,
    PerfilPasswordChange,
    PerfilPetsInfo,
    PerfilDeleteModal,
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private currentUserId: string | null = null;
  public user$ = new BehaviorSubject<UserResponseDTO | null>(null);
  public profileForm!: FormGroup;
  public isEditing = false;
  public isLoading = true;

  public errorMessage: string | null = null;
  public successMessage: string | null = null;
  public showPasswordModal: boolean = false;

  public showDeleteModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    const user = this.authService.getUser();
    if (user) this.currentUserId = user.id;
    this.createForm();
  }

  ngOnInit(): void {
    // LÓGICA DE CARGA DE DATOS PRINCIPAL
    if (this.currentUserId) this.loadUserData();
    else this.isLoading = false;
  }

  createForm(): void {
    this.profileForm = this.fb.group(
      {
        name: [
          { value: '', disabled: !this.isEditing },
          [Validators.required, Validators.minLength(2)],
        ],
        email: [{ value: '', disabled: true }],
        department: [{ value: '', disabled: !this.isEditing },
          [Validators.required],
        ],
        province: [{ value: '', disabled: !this.isEditing },
          [Validators.required],
        ],
        district: [{ value: '', disabled: !this.isEditing }
          , [Validators.required]
        ],
        newPassword: ['', [Validators.minLength(8)]],
        confirmNewPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const newPass = form.get('newPassword');
    const confirmPass = form.get('confirmNewPassword');
    if (newPass && confirmPass && newPass.value !== confirmPass.value) {
      return { passwordsNotMatching: true };
    }
    return null;
  }

  loadUserData(): void {
    if (!this.currentUserId) return;
    this.isLoading = true;
    this.userService.getUserById(this.currentUserId).subscribe({
      next: (user) => {
        this.user$.next(user);
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          department: user.department,
          province: user.province,
          district: user.district,
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar perfil: ' + (err.error?.message || err.message);
        this.isLoading = false;
      },
    });
  }

  toggleEditMode(enable: boolean): void {
    this.isEditing = enable;

    if(!enable){
      this.showPasswordModal = false;
      this.errorMessage = null;
      this.successMessage = null;
    }
    Object.keys(this.profileForm.controls).forEach((key) => {
      if (key !== 'email' && key !== 'newPassword' && key !== 'confirmNewPassword') {
        this.isEditing ? this.profileForm.get(key)!.enable() : this.profileForm.get(key)!.disable();
      }
    });
  }

  onSaveChanges(): void {
    if (!this.currentUserId || this.profileForm.invalid) return;
    this.errorMessage = null;
    this.successMessage = null;

    const updatePayload: UserUpdateDTO = {
      name: this.profileForm.get('name')!.value,
      department: this.profileForm.get('department')!.value,
      province: this.profileForm.get('province')!.value,
      district: this.profileForm.get('district')!.value,
    };

    this.userService.updateUser(this.currentUserId, updatePayload).subscribe({
      next: (UpdatedUser) => {
        this.user$.next(UpdatedUser);
        this.toggleEditMode(false);
        this.successMessage = 'Perfil actualizado exitosamente';
      },
      error: (err) => {
        this.errorMessage = 'Error al actualizar:' + err.error.message;
      },
    });
  }

  
  openPasswordChange(): void {
    this.showPasswordModal = !this.showPasswordModal;
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.showPasswordModal) {
      this.profileForm.get('newPassword')!.reset('');
      this.profileForm.get('confirmNewPassword')!.reset('');
    }
    this.profileForm.updateValueAndValidity();
  }

  onPasswordChangeSubmit(): void {
    if (!this.currentUserId) return;

    const newPassControl = this.profileForm.get('newPassword')!;
    const confirmPassControl = this.profileForm.get('confirmNewPassword')!;

    newPassControl.markAsTouched();
    confirmPassControl.markAsTouched();

    if (newPassControl.invalid || this.profileForm.hasError('passwordsNotMatching')) {
      this.errorMessage =
        'Verifique que la contraseña cumpla con los requisitos minimos (minimo 8 caracteres) y coincida';
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    const passwordUpdatePayLoad: UserUpdateDTO = {
      name: this.profileForm.get('name')!.value,
      department: this.profileForm.get('department')!.value,
      district: this.profileForm.get('district')!.value,
      province: this.profileForm.get('province')!.value,
      password: newPassControl.value,
    };

    this.userService.updateUser(this.currentUserId, passwordUpdatePayLoad).subscribe({
      next: () => {
        this.successMessage = 'Contraseña actualizada exitosamente.';
        this.showPasswordModal = false;
        newPassControl.reset('');
        confirmPassControl.reset('');
      },
      error: (err) => {
        this.errorMessage =
          'Error al cambiar la contraseña: ' + (err.error?.message || 'Error de conexión');
      },
    });
  }

  openDeleteModal():void{
    this.showDeleteModal = true;
  }

  closeDeteleteModal():void{
    this.showDeleteModal = false;
  }

  confirmDeleteAccount():void{
    if(!this.currentUserId) return;
    this.userService.deleteUser (this.currentUserId).subscribe({
      next:()=>{
        console.log('cuenta eliminada');
        this.authService.logout();
      },
      error: (err)=>{
        this.errorMessage = 'Error al eliminar la cuenta' +err;
      }
    })
  }
}
