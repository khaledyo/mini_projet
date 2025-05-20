import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ClasseService } from 'src/app/services/classe.service';
import { Etudiant } from 'src/app/model/etudiant';

@Component({
  selector: 'app-add-etudiant',
  templateUrl: './add-etudiant.component.html',
  styleUrls: ['./add-etudiant.component.css']
})
export class AddEtudiantComponent implements OnInit {
  newEtudiant: Etudiant = {
    _id: '', 
    email: '',
    nom: '',
    prenom: '',
    niveau: '',
    classe: '',
    carteEtudiant: ''
  };
  niveaux: string[] = ['1ere_annee', '2eme_annee', '3eme_annee'];
  classes: string[] = [];
  isEditMode = false;

  constructor(
    private etudiantService: EtudiantService,
    private classeService: ClasseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadEtudiant(id);
    }
  }
  

  loadEtudiant(id: string): void {
    this.etudiantService.getEtudiantById(id).subscribe(
      (data: Etudiant) => {
        this.newEtudiant = data;
        this.loadClasses(); 
      },
      error => {
        console.error('Error loading student', error);
      }
    );
  }

  loadClasses(): void {
    if (this.newEtudiant.niveau) {
      this.classeService.getClasseByAnnee(this.newEtudiant.niveau).subscribe(
        (data: string[]) => {
          this.classes = data;
        },
        error => {
          console.error('Error loading classes', error);
        }
      );
    } else {
      this.classes = [];
    }
  }

  addEtudiant(): void {
 const email = this.newEtudiant.email?.toLowerCase();
const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;

if (!email || !emailRegex.test(email)) {
  alert("L'email doit être une adresse Gmail valide (ex: exemple@gmail.com).");
  return;
}

    if (this.newEtudiant.email && this.newEtudiant.nom && this.newEtudiant.prenom &&
        this.newEtudiant.niveau && this.newEtudiant.classe) {
      this.etudiantService.addEtudiant(this.newEtudiant).subscribe(
        response => {
          alert('Étudiant ajouté avec succès!');
          this.router.navigate(['/etudiants']);
        },
        error => {
          console.error('Error adding student', error);
        }
      );
    } else {
      alert('Tous les champs sont nécessaires.');
    }
  }

  updateEtudiant(): void {
    if (this.newEtudiant.email && this.newEtudiant.nom && this.newEtudiant.prenom &&
        this.newEtudiant.niveau && this.newEtudiant.classe && this.newEtudiant.carteEtudiant) {
      this.etudiantService.updateEtudiant(this.newEtudiant._id, this.newEtudiant).subscribe(
        response => {
          alert('Étudiant modifié avec succès!');
          this.router.navigate(['/etudiants']);
        },
        error => {
          console.error('Error updating student', error);
        }
      );
    } else {
      alert('Tous les champs sont nécessaires.');
    }
  }

  goBack(): void {
    this.router.navigate(['/etudiants']);
  }
}