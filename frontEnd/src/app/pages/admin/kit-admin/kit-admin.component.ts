import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KitsService } from '../../../services/kits/kits.service';

@Component({
  selector: 'app-kit-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './kit-admin.component.html',
  styleUrls: ['./kit-admin.component.css']
})
export class KitAdminComponent implements OnInit {
  kits: any[] = [];
  showModal = false;
  form: FormGroup;
  editMode = false;
  currentId: number | null = null;
  selectedImage: File | null = null;

  constructor(private kitService: KitsService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nom: [''],
      description: [''],
      prix: [''],
      stock: ['']
    });
  }

  ngOnInit(): void {
    this.loadKits();
  }

  loadKits(): void {
    this.kitService.getAllKits().subscribe({
      next: data => this.kits = data,
      error: err => console.error(err)
    });
  }

  openModal(kit: any = null): void {
    this.editMode = !!kit;
    this.showModal = true;
    this.selectedImage = null;
    if (kit) {
      this.currentId = kit.id;
      this.form.patchValue({
        nom: kit.nom,
        description: kit.description,
        prix: kit.prix,
        stock: kit.stock
      });
    } else {
      this.currentId = null;
      this.form.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.form.reset();
    this.selectedImage = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  submit(): void {
    const formData = new FormData();
    formData.append('nom', this.form.value.nom);
    formData.append('description', this.form.value.description);
    formData.append('prix', this.form.value.prix);
    formData.append('stock', this.form.value.stock);
    if (this.selectedImage) {
      formData.append('img', this.selectedImage);
    }

    if (this.editMode && this.currentId !== null) {
      this.kitService.update(this.currentId, formData).subscribe({
        next: () => {
          this.loadKits();
          this.closeModal();
        }
      });
    } else {
      this.kitService.add(formData).subscribe({
        next: () => {
          this.loadKits();
          this.closeModal();
        }
      });
    }
  }

  deleteKit(id: number): void {
    if (confirm("Confirmer la suppression ?")) {
      this.kitService.delete(id).subscribe({
        next: () => this.loadKits()
      });
    }
  }
}
