import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClasseService } from 'src/app/services/classe.service';
import { Classe } from 'src/app/model/classe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any;
@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css'],
})
export class ClasseComponent implements OnInit {
  displayedColumns: string[] = ['annee', 'classes', 'action'];
  dataSource: MatTableDataSource<Classe>;
  @ViewChild('classeModal') modal!: ElementRef; // Reference to the modal

  classeForm: FormGroup; // Define the form group
  isEdit = false;
  currentAnnee: string = '';
  currentClasse: string = '';

  constructor(private classeService: ClasseService,private fb: FormBuilder) {
    this.dataSource = new MatTableDataSource<Classe>([]);
    this.classeForm = this.fb.group({
      annee: ['', Validators.required],
      classe: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classeService.getClasses().subscribe((result: Classe[]) => {
      this.dataSource.data = result;
    });
  }

  // Supprimer une classe spécifique dans un niveau
  deleteClasse(annee: string, classe: string) {
    if (confirm(`Voulez-vous supprimer la classe ${classe} de l'année ${annee} ?`)) {
      this.classeService.deleteClasse(annee, classe).subscribe(() => {
        this.loadClasses();
      });
    }
  }

  
  deleteAnnee(annee: string) {
    if (confirm(`Voulez-vous supprimer le niveau ${annee} et toutes ses classes ?`)) {
      this.classeService.deleteNiveau(annee).subscribe(() => {
        this.loadClasses();
      });
    }
  }
  openModal() {
    this.classeForm.reset(); // Reset the form
    const modalElement = this.modal.nativeElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  addClasse() {
    if (this.classeForm.invalid) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const { annee, classe } = this.classeForm.value;
    this.classeService.addClasse(annee, classe).subscribe(
      () => {
        this.loadClasses();
        this.closeModal(); // Close the modal after adding
      },
      (err) => {
        if (err.error && err.error.message === 'La classe existe déjà.') {
          alert('Cette classe existe déjà pour cette année.');
        } else {
          alert('Une erreur s\'est produite lors de l\'ajout de la classe.');
        }
        this.closeModal();
      }
    );
  }
  
  
  closeModal() {
    const modalElement = this.modal.nativeElement;
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide(); // Hide the modal if it exists
    }
  }
  
  
}
