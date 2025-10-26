import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-perfil-password-change',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-password-change.html',
  styleUrl: './perfil-password-change.css',
})
export class PerfilPasswordChange {
  @Input() profileForm!: FormGroup;
  @Input() showPasswordModal!: boolean;
  @Input() errorMessage: string | null = null;

  @Output() toggleModal = new EventEmitter<void>();
  @Output() submitPassword = new EventEmitter<void>();

  onToggleModal() {
    this.toggleModal.emit();
  }

  onSubmit() {
    this.submitPassword.emit();
  }
}
