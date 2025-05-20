import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AffectationService, Affectation, Enseignant, Etudiant } from 'src/app/services/affectation.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ClasseService } from 'src/app/services/classe.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pfe',
  templateUrl: './pfe.component.html',
  styleUrls: ['./pfe.component.css']
})
export class PFEComponent implements OnInit {
  affectations: Affectation[] = [];
  enseignantsList: Enseignant[] = [];
  classesList: string[] = [];
  filteredEtudiants: any[] = [];
  allEtudiants: any[] = [];
  loading = false;
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  selectedAffectation: Affectation | null = null;
  selectedEtudiantIndex: number | null = null;
  editForm: FormGroup;
  etudiantForm: FormGroup;
  formError: string | null = null;
  etudiantFormError: string | null = null;

  constructor(
    private affectationService: AffectationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private etudiantService: EtudiantService,
    private classeService: ClasseService
  ) {
    this.editForm = this.fb.group({
  enseignant1: ['', Validators.required],
  enseignant2: ['', Validators.required],
  encadrant: ['', Validators.required], // Gardez cette ligne
  salle: ['', [Validators.required, Validators.pattern(/^(B|INFO B)\d{2}$/)]]
}, { 
  validators: this.uniqueEnseignantsValidator 
});

    this.etudiantForm = this.fb.group({
      nom: ['', Validators.required],
      classe: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadClassesAndEtudiants();
  }

  private loadClassesAndEtudiants(): void {
    this.classeService.getClassesByAnnee('3eme_annee').subscribe({
      next: (classes) => {
        this.classesList = classes;
        this.loadAllEtudiants();
      },
      error: (err) => {
        console.error('Error loading classes:', err);
        this.showMessage('Erreur de chargement des classes', 'error');
      }
    });
  }

  private loadAllEtudiants(): void {
    this.etudiantService.getEtudiants().subscribe({
      next: (etudiants) => {
        this.allEtudiants = etudiants.map(etu => ({
          _id: etu._id,
          nom: etu.nom,
          prenom: etu.prenom,
          classe: etu.classe,
          email: etu.email
        }));
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.showMessage('Erreur de chargement des étudiants', 'error');
      }
    });
  }

  private loadInitialData(): void {
    this.loading = true;
    this.message = null;
    this.affectationService.getPfeAffectations().subscribe({
      next: (affectations) => {
        this.affectations = affectations;
        this.loadEnseignants();
      },
      error: (err) => {
        console.error('Error loading affectations:', err);
        this.showMessage('Erreur de chargement des affectations', 'error');
        this.loading = false;
      }
    });
  }

  private loadEnseignants(): void {
    this.affectationService.getEnseignants().subscribe({
      next: (enseignants) => {
        this.enseignantsList = enseignants;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading enseignants:', err);
        this.showMessage('Erreur de chargement des enseignants', 'error');
        this.loading = false;
      }
    });
  }

  generateAffectations(): void {
    this.loading = true;
    this.message = null;
    this.affectationService.generatePfeAffectations().subscribe({
      next: (affectations) => {
        this.affectations = affectations;
        this.showMessage('Affectations PFE générées avec succès', 'success');
      },
      error: (err) => {
        console.error('Error generating affectations:', err);
        this.showMessage('Erreur lors de la génération', 'error');
      },
      complete: () => this.loading = false
    });
  }

  onClasseChange(classe: string): void {
    if (classe) {
      this.filteredEtudiants = this.allEtudiants
        .filter(etu => etu.classe === classe)
        .map(etu => ({
          nomComplet: `${etu.prenom} ${etu.nom}`,
        }));
    } else {
      this.filteredEtudiants = [];
    }
    this.etudiantForm.patchValue({ nom: '' });
  }

  private uniqueEnseignantsValidator(group: FormGroup): { [key: string]: any } | null {
    const enseignant1 = group.get('enseignant1')?.value;
    const enseignant2 = group.get('enseignant2')?.value;
    const encadrant = group.get('encadrant')?.value;
    
    // Vérifie que les enseignants sont différents
    if (enseignant1 && enseignant2 && enseignant1 === enseignant2) {
      return { sameEnseignants: true };
    }
    
    // Vérifie que l'encadrant est différent des membres du jury
    if (encadrant && (encadrant === enseignant1 || encadrant === enseignant2)) {
      return { encadrantInJury: true };
    }
    
    return null;
  }

  get enseignant1(): AbstractControl | null { return this.editForm.get('enseignant1'); }
  get enseignant2(): AbstractControl | null { return this.editForm.get('enseignant2'); }
  get encadrant(): AbstractControl | null { return this.editForm.get('encadrant'); }
  get salle(): AbstractControl | null { return this.editForm.get('salle'); }
  get etudiantNom(): AbstractControl | null { return this.etudiantForm.get('nom'); }
  get etudiantClasse(): AbstractControl | null { return this.etudiantForm.get('classe'); }

  openEditModal(content: any, affectation: Affectation): void {
  this.selectedAffectation = affectation;
  this.editForm.setValue({
    enseignant1: affectation.enseignants[0],
    enseignant2: affectation.enseignants[1],
    encadrant: affectation.encadrant || '', 
    salle: affectation.salle
  });
  this.modalService.open(content, { 
    size: 'lg',
    backdrop: 'static'
  });
}

  openEditEtudiantModal(content: any, affectation: Affectation, etudiantIndex: number): void {
  this.selectedAffectation = affectation;
  this.selectedEtudiantIndex = etudiantIndex;
  const etudiant = affectation.etudiants[etudiantIndex];
  
  this.etudiantForm.setValue({
    nom: etudiant.nom, // Garde le nom complet "prénom nom"
    classe: etudiant.classe
  });
  
  if (etudiant.classe) {
    this.onClasseChange(etudiant.classe);
    // Sélectionne automatiquement l'étudiant dans la liste
    setTimeout(() => {
      this.etudiantForm.patchValue({ nom: etudiant.nom });
    });
  }
  
  this.modalService.open(content);
}

  async saveChanges(): Promise<void> {
    this.formError = null;
    if (this.editForm.invalid || !this.selectedAffectation) {
      this.formError = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }
    
    const newEnseignants = [
      this.editForm.value.enseignant1,
      this.editForm.value.enseignant2
    ];
    
    if (newEnseignants[0] === newEnseignants[1]) {
      this.formError = 'Un enseignant ne peut pas être sélectionné deux fois dans le jury';
      return;
    }
    
    if (this.editForm.value.encadrant === newEnseignants[0] || 
        this.editForm.value.encadrant === newEnseignants[1]) {
      this.formError = "L'encadrant ne peut pas faire partie du jury";
      return;
    }
    
    try {
      const isAvailable = await this.affectationService.checkEnseignantAvailability(
        newEnseignants,
        this.selectedAffectation._id
      ).toPromise();
      
      if (!isAvailable) {
        this.formError = 'Un ou plusieurs enseignants sont déjà affectés à un autre jury PFE';
        return;
      }
      
      this.loading = true;
      const updatedData = {
  enseignants: newEnseignants,
  encadrant: this.editForm.value.encadrant, 
  salle: this.editForm.value.salle
};
      this.affectationService.updateAffectation(
        this.selectedAffectation._id,
        updatedData
      ).subscribe({
        next: (updated) => {
          const index = this.affectations.findIndex(a => a._id === updated._id);
          if (index !== -1) {
            this.affectations[index] = updated;
          }
          this.modalService.dismissAll();
          this.showMessage('Jury PFE modifié avec succès', 'success');
        },
        error: (err) => {
          console.error('Error updating affectation:', err);
          this.showMessage('Erreur lors de la modification', 'error');
        },
        complete: () => this.loading = false
      });
    } catch (err) {
      console.error('Error checking availability:', err);
      this.showMessage('Erreur lors de la vérification', 'error');
    }
  }

  saveEtudiantChanges(): void {
    this.etudiantFormError = null;
    if (this.etudiantForm.invalid || !this.selectedAffectation || this.selectedEtudiantIndex === null) {
      this.etudiantFormError = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }
    
    const updatedEtudiant = {
      nom: this.etudiantForm.value.nom,
      classe: this.etudiantForm.value.classe
    };
    
    this.affectationService.updateEtudiantInAffectation(
      this.selectedAffectation._id,
      this.selectedEtudiantIndex,
      updatedEtudiant
    ).subscribe({
      next: (updatedAffectation) => {
        const index = this.affectations.findIndex(a => a._id === updatedAffectation._id);
        if (index !== -1) {
          this.affectations[index] = updatedAffectation;
        }
        this.modalService.dismissAll();
        this.showMessage('Étudiant modifié avec succès', 'success');
      },
      error: (err) => {
        console.error('Error updating student:', err);
        this.showMessage('Erreur lors de la modification', 'error');
      }
    });
  }

  removeEtudiant(affectationId: string, etudiantIndex: number): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
    this.loading = true;
    this.affectationService.removeEtudiantFromAffectation(
      affectationId,
      etudiantIndex
    ).subscribe({
      next: (response: any) => {
       
        if (response.deleted) {
          
          this.affectations = this.affectations.filter(a => a._id !== affectationId);
          this.showMessage('Dernier étudiant supprimé - Jury supprimé', 'success');
        } 
       
        else {
          // Trouver l'index de l'affectation mise à jour
          const index = this.affectations.findIndex(a => a._id === response._id);
          
          if (index !== -1) {
            // Remplacer l'ancienne affectation par la nouvelle version mise à jour
            this.affectations[index] = response;
          }
          this.showMessage('Étudiant supprimé avec succès', 'success');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error removing student:', err);
        this.showMessage('Erreur lors de la suppression: ' + err.message, 'error');
        this.loading = false;
      }
    });
  }
}

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
      this.messageType = null;
    }, 5000);
  }

  get enseignantOptions(): string[] {
    return this.enseignantsList.map(e => `${e.prenom} ${e.nom}`);
  }

  trackByAffectationId(index: number, item: Affectation): string {
    return item._id;
  }

  exportToExcel(): void {
    const data = [['Jury', 'Encadrant', 'Salle', 'Étudiant(e)', 'Classe', 'Stage']];
    
    this.affectations.forEach(aff => {
      aff.etudiants.forEach((etu, i) => {
        data.push([
          i === 0 ? `${aff.juryLabel} : ${aff.enseignants.join(' & ')}` : '',
          i === 0 ? (aff.encadrant ?? '') : '',
          i === 0 ? aff.salle : '',
          etu.nom,
          etu.classe,
          aff.stageType
        ]);
      });
    });
    
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Affectations PFE');
    
    ws['!cols'] = [
      { width: 40 }, { width: 30 }, { width: 15 }, { width: 30 }, { width: 15 }, { width: 20 }
    ];
    
    XLSX.writeFile(wb, `Affectations_PFE_${new Date().toISOString().slice(0,10)}.xlsx`);
  }
}