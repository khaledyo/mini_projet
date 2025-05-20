import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EnseignantService } from 'src/app/services/enseignant.service';
import { EtudiantComponent } from '../etudiant/etudiant.component';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { AffectationService } from 'src/app/services/affectation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  nombreEnseignants: number = 0;
  nombreEtuds: number = 0;
  nombreEtudiantsAffectes: number = 0;
  
  enseignantService = inject(EnseignantService);
  etudiantService = inject(EtudiantService);
  affectationService = inject(AffectationService);

  ngOnInit() {
    this.enseignantService.getEnseig().subscribe((data) => {
      this.nombreEnseignants = data.length;
    });
    
    this.etudiantService.getEtudiants().subscribe((data) => {
      this.nombreEtuds = data.length;
    });
    
    this.affectationService.getAffectedStudentsCount().subscribe((count) => {
      this.nombreEtudiantsAffectes = count;
    });
  }
}