import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnseignantService } from 'src/app/services/enseignant.service';
import { Enseignant } from 'src/app/model/enseignant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any; // Declare Bootstrap globally

@Component({
  selector: 'app-enseignant',
  templateUrl: './enseignant.component.html',
  styleUrls: ['./enseignant.component.css'],
})
export class EnseignantComponent implements AfterViewInit {
  displayedColumns: string[] = ['email', 'nom', 'prenom', 'action'];
  dataSource: MatTableDataSource<Enseignant>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('enseignantModal') modal!: ElementRef; // Reference to the modal

  enseignantForm: FormGroup; // Define the form group
  isEdit = false;
  enseignantId!: string;

  constructor(
    private enseignantService: EnseignantService,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<Enseignant>([]);

    // Initialize the form with validation rules
    this.enseignantForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Add email validation
    });
  }

  ngOnInit() {
    this.loadEnseignants();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEnseignants() {
    this.enseignantService.getEnseig().subscribe((result: Enseignant[]) => {
      this.dataSource.data = result;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(id: string) {
    
    if (confirm(`Voulez-vous supprimer cet enseignant ?`)) {
      this.enseignantService.deleteEnseig(id).subscribe(() => {
        this.loadEnseignants();
      });
    }
  }

  openModal(id?: string) {
    this.isEdit = !!id;
    if (id) {
      this.enseignantId = id;
      this.enseignantService.getEnseigById(id).subscribe((result: Enseignant) => {
        this.enseignantForm.patchValue(result); // Populate the form with fetched data
      });
    } else {
      this.resetForm(); // Reset the form for adding new enseignant
    }
  }

  resetForm() {
    this.enseignantForm.reset(); // Reset the form
    this.isEdit = false; // Set isEdit to false
  }

  add() {
    if (this.enseignantForm.invalid) {
      alert('Veuillez remplir tous les champs requis et fournir une adresse email valide.');
      return;
    }

    const newEnseignant: Enseignant = this.enseignantForm.value;
    this.enseignantService.addEnseig(newEnseignant).subscribe(() => {
      this.loadEnseignants();
      this.closeModal(); // Close the modal after adding
    });
  }

  update() {
    if (this.enseignantForm.invalid) {
      alert('Veuillez remplir tous les champs requis et fournir une adresse email valide.');
      return;
    }

    const updatedEnseignant: Enseignant = this.enseignantForm.value;
    this.enseignantService.updateEnseig(this.enseignantId, updatedEnseignant).subscribe(() => {
      this.loadEnseignants();
      this.closeModal(); // Close the modal after updating
    });
  }

  closeModal() {
    const modalElement = this.modal.nativeElement;
    const modal = bootstrap.Modal.getInstance(modalElement); // Get the modal instance
    if (modal) {
      modal.hide(); // Hide the modal if it exists
    } else {
      // If the modal instance doesn't exist, create a new one and hide it
      new bootstrap.Modal(modalElement).hide();
    }
  }
}