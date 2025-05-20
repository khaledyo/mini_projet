import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe } from '../model/classe';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:3000/classe';

  constructor(private http: HttpClient) { }

  // Pour obtenir toutes les classes sous forme de string[]
  getClassesByAnnee(annee: string): Observable<string[]> {
    return this.http.get<Classe[]>(this.apiUrl).pipe(
      map((niveaux: Classe[]) => {
        const niveau = niveaux.find(n => n.annee === annee);
        return niveau ? niveau.classes : [];
      })
    );
  }

  // Récupérer toutes les classes et niveaux
  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl);
  }
  addClasse(annee: string, classe: string): Observable<any> {
    return this.http.post(this.apiUrl, { annee, classe });
  }

  // Supprimer une classe spécifique d'un niveau
  deleteClasse(annee: string, classe: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${annee}/classe/${classe}`);
  }

  // Supprimer un niveau entier
  deleteNiveau(annee: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${annee}`);
  }

  updateClasse(annee: string, classe: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${annee}`, { classe });
  }

  getClasseByAnnee(annee: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${annee}`);
  }
}
 