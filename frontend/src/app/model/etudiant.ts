export interface Etudiant {
    _id: string; // Ensure this is included
    email: string;
    nom: string;
    prenom: string;
    niveau: string;
    classe: string;
    carteEtudiant?: string;
  }