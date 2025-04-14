import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TestService} from '../../../services/test/test.service';

@Component({
  selector: 'app-test-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './test-admin.component.html',
  styleUrl: './test-admin.component.css'
})
export class TestAdminComponent implements OnInit{
  tests: any[] = [];
  showModal = false;
  form: FormGroup;
  editMode = false;
  currentId: number | null = null;

  constructor(private testService: TestService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nom: [''],
      description: [''],
      prix: ['']
    });
  }

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    this.testService.getAllTest().subscribe({
      next: data => this.tests = data,
      error: err => console.error(err)
    });
  }

  openModal(test: any = null): void {
    this.editMode = !!test;
    this.showModal = true;
    if (test) {
      this.currentId = test.id;
      this.form.patchValue(test);
    } else {
      this.currentId = null;
      this.form.reset();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.form.reset();
  }

  submit(): void {
    if (this.editMode && this.currentId !== null) {
      this.testService.update(this.currentId, this.form.value).subscribe({
        next: () => {
          this.loadTests();
          this.closeModal();
        }
      });
    } else {
      this.testService.add(this.form.value).subscribe({
        next: () => {
          this.loadTests();
          this.closeModal();
        }
      });
    }
  }

  deleteTest(id: number): void {
    if (confirm("Confirmer la suppression ?")) {
      this.testService.delete(id).subscribe({
        next: () => this.loadTests()
      });
    }
  }



}
