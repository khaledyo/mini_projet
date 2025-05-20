import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Etudiant {
  nom: string;
  classe: string;
}

export interface Enseignant {
  _id: string;
  nom: string;
  prenom: string;
}

export interface Affectation {
  _id: string;
  juryLabel: string;
  enseignants: string[];
  encadrant?: string;
  salle: string;
  stageType: string;
  etudiants: Etudiant[];
}

@Injectable({
  providedIn: 'root'
})
export class AffectationService {
  private apiUrl = 'http://localhost:3000/api/affectation';

  constructor(private http: HttpClient) {}

  generateAffectations(stageType: string = 'initiation'): Observable<Affectation[]> {
    const endpoint = stageType === 'initiation' ? 'initiation' : 'perfectionnement';
    return this.http.post<Affectation[]>(`${this.apiUrl}/${endpoint}`, {});
  }

  getAffectations(): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(this.apiUrl);
  }

  getInitiationAffectations(): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(`${this.apiUrl}/initiation`);
  }

  getPerfectionnementAffectations(): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(`${this.apiUrl}/perfectionnement`);
  }

  updateAffectation(
    id: string, 
    data: { enseignants: string[], encadrant?: string, salle: string }
  ): Observable<Affectation> {
    return this.http.put<Affectation>(`${this.apiUrl}/${id}`, data);
  }

  getEnseignants(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(`${this.apiUrl}/enseignants`);
  }

  checkEnseignantAvailability(enseignants: string[], excludeAffectationId?: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check-availability`, {
      enseignants,
      excludeAffectationId
    });
  }

  updateEtudiantInAffectation(affectationId: string, etudiantIndex: number, newData: Etudiant): Observable<Affectation> {
    return this.http.put<Affectation>(`${this.apiUrl}/${affectationId}/etudiants/${etudiantIndex}`, newData);
  }

  removeEtudiantFromAffectation(affectationId: string, etudiantIndex: number): Observable<Affectation | { deleted: boolean }> {
  return this.http.delete<Affectation | { deleted: boolean }>(`${this.apiUrl}/${affectationId}/etudiants/${etudiantIndex}`);
}

  getAffectedStudentsCount(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/affected-students/count`);
}

  getPfeAffectations(): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(`${this.apiUrl}/pfe`);
  }

  generatePfeAffectations(): Observable<Affectation[]> {
    return this.http.post<Affectation[]>(`${this.apiUrl}/pfe`, {});
  }
}