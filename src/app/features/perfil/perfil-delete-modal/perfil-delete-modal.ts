import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-perfil-delete-modal',
  imports: [CommonModule],
  templateUrl: './perfil-delete-modal.html',
  styleUrl: './perfil-delete-modal.css'
})
export class PerfilDeleteModal {
  @Input() showModal: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();


  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

}
