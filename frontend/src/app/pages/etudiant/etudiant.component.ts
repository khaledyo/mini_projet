import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ClasseService } from 'src/app/services/classe.service';
import { EtudiantService } from 'src/app/services/etudiant.service';

import { Etudiant } from 'src/app/model/etudiant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})
export class EtudiantComponent implements OnInit {
  constructor(
    private etudiantService: EtudiantService,
    private classeService: ClasseService
  ) {
    this.dataSource = new MatTableDataSource();
  }
  selectedFile: File | null = null;
  message: string = '';
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.selectedFile) {
      this.etudiantService.importExcel(this.selectedFile).subscribe({
        next: (response) => {
          this.message = response.message || 'Importation réussie !';
          this.loadEtudiants();
        },
        error: (error) => {
          this.message = 'Erreur lors de l’importation : ' + (error.error?.message || error.message);
        }
      });
    }
  }
  displayedColumns: string[] = ['carteEtudiant', 'nom', 'prenom', 'niveau', 'classe', 'email' ,'actions'];
  dataSource: MatTableDataSource<Etudiant>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  classes: string[] = [];
  niveaux: string[] = ['1ere_annee', '2eme_annee', '3eme_annee']; // Example levels
  newEtudiant: Etudiant = {
    _id: '', 
    email: '',
    nom: '',
    prenom: '',
    niveau: '',
    classe: '',
    carteEtudiant: ''
  };

  
  router=inject(Router);
  ngOnInit(): void {
    this.loadEtudiants(); 
  }

  editEtudiant(etudiant: Etudiant): void {
    this.router.navigate(['/add-etudiant', etudiant._id]);
  }
  loadEtudiants(): void {
    this.etudiantService.getEtudiants().subscribe(
      (data: Etudiant[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error loading students', error);
      }
    );
  }

  // Load classes based on the selected level
  loadClasses(): void {
    if (this.newEtudiant.niveau) {
      this.classeService.getClasseByAnnee(this.newEtudiant.niveau).subscribe(
        (data: string[]) => {
            console.log(data); // Log the data to verify
            this.classes = data;
        },
        error => {
            console.error('Error loading classes', error);
        }
    );
    } else {
        this.classes = []; // Reset classes if no niveau is selected
    }
  }

  // Add a new student
  addEtudiant(): void {
    if (this.newEtudiant.email && this.newEtudiant.nom && this.newEtudiant.prenom &&
        this.newEtudiant.niveau && this.newEtudiant.classe && this.newEtudiant.carteEtudiant) {
      this.etudiantService.addEtudiant(this.newEtudiant).subscribe(
        response => {
          alert('Étudiant ajouté avec succès!');
          this.loadEtudiants(); // Refresh the list of students
        },
        error => {
          console.error('Error adding student', error);
        }
      );
    } else {
      alert('Tous les champs sont nécessaires.');
    }
  }

  // Delete a student
  deleteEtudiant(id: string): void {
    this.etudiantService.deleteEtudiant(id).subscribe(
      response => {
        alert('Étudiant supprimé avec succès!');
        this.loadEtudiants();  // Refresh the list of students
      },
      error => {
        console.error('Error deleting student', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}