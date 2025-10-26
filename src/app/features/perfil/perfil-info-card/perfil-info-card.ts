import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserResponseDTO } from '../../../models/user';
@Component({
  selector: 'app-perfil-info-card',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-info-card.html',
  styleUrl: './perfil-info-card.css',
})
export class PerfilInfoCard {
  @Input() profileForm!: FormGroup;
  @Input() user!: UserResponseDTO | null;

  isEmailDisabled(): boolean {
    return this.profileForm.get('email')!.disabled;
  }
}
