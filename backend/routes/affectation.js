const express = require('express');
const router = express.Router();
const Etudiant = require('../model/etudiant.js');
const Enseignant = require('../model/enseignant.js');
const Affectation = require('../model/affectation.js');
const Classe = require('../model/classe.js');

// Fonction pour mélanger un tableau aléatoirement
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fonction pour générer automatiquement des salles aléatoires (Info B01-B06 ou B01-B06)
function generateSalle() {
  const prefix = Math.random() > 0.5 ? "Info B" : "B";
  const number = Math.floor(Math.random() * 6) + 1; // Nombre entre 1 et 6
  return prefix + number.toString().padStart(2, '0');
}

// Fonction pour générer toutes les paires possibles d'enseignants
function generatePaires(enseignants) {
  const paires = [];
  for (let i = 0; i < enseignants.length; i++) {
    for (let j = i + 1; j < enseignants.length; j++) {
      paires.push([enseignants[i], enseignants[j]]);
    }
  }
  return shuffleArray(paires);
}

// Vérifie si les enseignants sont déjà affectés à d'autres jurys du même type
async function checkEnseignantsDisponibles(enseignants, stageType, excludeAffectationId = null) {
  const query = {
    'enseignants': { $in: enseignants },
    'stageType': stageType
  };

  if (excludeAffectationId) {
    query['_id'] = { $ne: excludeAffectationId };
  }

  const existingAffectation = await Affectation.findOne(query);
  return !existingAffectation;
}

/* ROUTES GET */

// Route pour vérifier l'état de la base de données (debug)
router.get('/debug', async (req, res) => {
  try {
    const initiations = await Affectation.find({ stageType: "initiation" });
    const perfectionnements = await Affectation.find({ stageType: "perfectionnement" });
    
    res.json({
      initiationCount: initiations.length,
      perfectionnementCount: perfectionnements.length,
      allInitiations: initiations,
      allPerfectionnements: perfectionnements
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET pour les affectations de perfectionnement
router.get('/perfectionnement', async (req, res) => {
  try {
    const affectations = await Affectation.find({ stageType: "perfectionnement" });
    res.json(affectations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET pour les affectations d'initiation
router.get('/initiation', async (req, res) => {
  try {
    const affectations = await Affectation.find({ stageType: "initiation" });
    res.json(affectations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET pour toutes les affectations ou filtrées par type
router.get('/', async (req, res) => {
  try {
    const stageType = req.query.stageType;
    const query = stageType ? { stageType } : {};
    const affectations = await Affectation.find(query);
    res.json(affectations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route GET pour la liste des enseignants
router.get('/enseignants', async (req, res) => {
  try {
    const enseignants = await Enseignant.find();
    res.json(enseignants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ROUTES POST */

// Route POST pour générer les affectations d'initiation
router.post('/initiation', async (req, res) => {
  try {
    // Supprimer les anciennes affectations d'initiation
    await Affectation.deleteMany({ stageType: "initiation" });

    const classe1ere = await Classe.findOne({ annee: "1ere_annee" });
    if (!classe1ere) {
      return res.status(404).json({ error: "Classe 1ere_annee non trouvée" });
    }

    let etudiants = await Etudiant.find({ niveau: classe1ere._id });
    etudiants = shuffleArray(etudiants);

    let enseignants = await Enseignant.find();
    enseignants = shuffleArray(enseignants);

    const paires = generatePaires(enseignants);
    const etudiantAffectes = new Set();
    const compteurParEnseignant = new Map();
    let juryIndex = 1;
    const affectations = [];

    for (const paire of paires) {
      const [ens1, ens2] = paire;
      const nomsEnseignants = [`${ens1.prenom} ${ens1.nom}`, `${ens2.prenom} ${ens2.nom}`];
      
      // Vérifier que les enseignants ne sont pas déjà dans un autre jury d'initiation
      const disponibles = await checkEnseignantsDisponibles(nomsEnseignants, "initiation");
      if (!disponibles) continue;

      const ens1Id = ens1._id.toString();
      const ens2Id = ens2._id.toString();
      const juryEtudiants = [];

      for (const etu of etudiants) {
        const etuId = etu._id.toString();

        if (etudiantAffectes.has(etuId)) continue;

        const c1 = compteurParEnseignant.get(ens1Id) || 0;
        const c2 = compteurParEnseignant.get(ens2Id) || 0;

        if (c1 >= 6 || c2 >= 6) continue;

        juryEtudiants.push({
          nom: `${etu.prenom} ${etu.nom}`,
          classe: etu.classe
        });

        etudiantAffectes.add(etuId);
        compteurParEnseignant.set(ens1Id, c1 + 1);
        compteurParEnseignant.set(ens2Id, c2 + 1);

        if (juryEtudiants.length === 6) break;
      }

      if (juryEtudiants.length > 0) {
        const affectation = new Affectation({
          juryLabel: `Jury Initiation ${juryIndex}`,
          enseignants: nomsEnseignants,
          salle: generateSalle(),
          stageType: "initiation",
          etudiants: juryEtudiants
        });

        await affectation.save();
        affectations.push(affectation);
        juryIndex++;
      }

      if (etudiantAffectes.size === etudiants.length) break;
    }

    res.status(201).json(affectations);
  } catch (err) {
    console.error('Erreur génération affectations initiation:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route POST pour générer les affectations de perfectionnement
router.post('/perfectionnement', async (req, res) => {
  try {
    // Supprimer les anciennes affectations de perfectionnement
    await Affectation.deleteMany({ stageType: "perfectionnement" });

    const classe2eme = await Classe.findOne({ annee: "2eme_annee" });
    if (!classe2eme) {
      return res.status(404).json({ error: "Classe 2eme_annee non trouvée" });
    }

    let etudiants = await Etudiant.find({ niveau: classe2eme._id });
    etudiants = shuffleArray(etudiants);

    let enseignants = await Enseignant.find();
    enseignants = shuffleArray(enseignants);

    const paires = generatePaires(enseignants);
    const etudiantAffectes = new Set();
    const compteurParEnseignant = new Map();
    let juryIndex = 1;
    const affectations = [];

    for (const paire of paires) {
      const [ens1, ens2] = paire;
      const nomsEnseignants = [`${ens1.prenom} ${ens1.nom}`, `${ens2.prenom} ${ens2.nom}`];
      
      // Vérifier que les enseignants ne sont pas déjà dans un autre jury de perfectionnement
      const disponibles = await checkEnseignantsDisponibles(nomsEnseignants, "perfectionnement");
      if (!disponibles) continue;

      const ens1Id = ens1._id.toString();
      const ens2Id = ens2._id.toString();
      const juryEtudiants = [];

      for (const etu of etudiants) {
        const etuId = etu._id.toString();

        if (etudiantAffectes.has(etuId)) continue;

        const c1 = compteurParEnseignant.get(ens1Id) || 0;
        const c2 = compteurParEnseignant.get(ens2Id) || 0;

        if (c1 >= 3 || c2 >= 3) continue;

        juryEtudiants.push({
          nom: `${etu.prenom} ${etu.nom}`,
          classe: etu.classe
        });

        etudiantAffectes.add(etuId);
        compteurParEnseignant.set(ens1Id, c1 + 1);
        compteurParEnseignant.set(ens2Id, c2 + 1);

        if (juryEtudiants.length === 6) break;
      }

      if (juryEtudiants.length > 0) {
        const affectation = new Affectation({
          juryLabel: `Jury Perfectionnement ${juryIndex}`,
          enseignants: nomsEnseignants,
          salle: generateSalle(),
          stageType: "perfectionnement",
          etudiants: juryEtudiants
        });

        await affectation.save();
        affectations.push(affectation);
        juryIndex++;
      }

      if (etudiantAffectes.size === etudiants.length) break;
    }

    res.status(201).json(affectations);
  } catch (err) {
    console.error('Erreur génération affectations perfectionnement:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route POST pour vérifier la disponibilité des enseignants
router.post('/check-availability', async (req, res) => {
  try {
    const { enseignants, stageType, excludeAffectationId } = req.body;
    
    const query = {
      'enseignants': { $in: enseignants },
      'stageType': stageType
    };

    if (excludeAffectationId) {
      query['_id'] = { $ne: excludeAffectationId };
    }

    const existingAffectation = await Affectation.findOne(query);
    
    res.json(!existingAffectation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ROUTES PUT */

// Route PUT pour modifier une affectation
router.put('/:id', async (req, res) => {
  try {
    const { enseignants, salle, stageType } = req.body;
    
    const disponibles = await checkEnseignantsDisponibles(enseignants, stageType, req.params.id);
    if (!disponibles) {
      return res.status(400).json({ 
        error: "Un ou plusieurs enseignants sont déjà affectés à un autre jury du même type" 
      });
    }

    const updatedAffectation = await Affectation.findByIdAndUpdate(
      req.params.id,
      { enseignants, salle },
      { new: true }
    );
    
    if (!updatedAffectation) {
      return res.status(404).json({ error: "Affectation non trouvée" });
    }

    res.json(updatedAffectation);
  } catch (err) {
    console.error('Erreur modification jury:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route PUT pour modifier un étudiant dans une affectation
router.put('/:id/etudiants/:etudiantIndex', async (req, res) => {
  try {
    const { id, etudiantIndex } = req.params;
    const newData = req.body;

    const affectation = await Affectation.findById(id);
    if (!affectation) {
      return res.status(404).json({ error: "Affectation non trouvée" });
    }

    if (etudiantIndex < 0 || etudiantIndex >= affectation.etudiants.length) {
      return res.status(400).json({ error: "Index étudiant invalide" });
    }

    affectation.etudiants[etudiantIndex] = newData;
    await affectation.save();

    res.json(affectation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ROUTES DELETE */

// Route DELETE pour supprimer un étudiant d'une affectation (CORRIGÉE)
// Route DELETE pour supprimer un étudiant d'une affectation (version améliorée)
router.delete('/:id/etudiants/:etudiantIndex', async (req, res) => {
  try {
    const { id, etudiantIndex } = req.params;
    const index = parseInt(etudiantIndex);

    if (isNaN(index) || index < 0) {
      return res.status(400).json({ error: "Index étudiant invalide" });
    }

    const affectation = await Affectation.findById(id);
    if (!affectation) {
      return res.status(404).json({ error: "Affectation non trouvée" });
    }

    if (index >= affectation.etudiants.length) {
      return res.status(400).json({ error: "Index étudiant hors limites" });
    }

    // Supprimer l'étudiant du tableau
    affectation.etudiants.splice(index, 1);

    // Si c'était le dernier étudiant, supprimer toute l'affectation
    if (affectation.etudiants.length === 0) {
      await Affectation.findByIdAndDelete(id);
      return res.json({ deleted: true });
    }

    // Sinon, sauvegarder la modification
    const updatedAffectation = await affectation.save();
    res.json(updatedAffectation);
  } catch (err) {
    console.error('Erreur suppression étudiant:', err);
    res.status(500).json({ 
      error: "Erreur lors de la suppression de l'étudiant",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Route POST pour générer les affectations PFE
router.post('/pfe', async (req, res) => {
  try {
    // Supprimer les anciennes affectations PFE
    await Affectation.deleteMany({ stageType: "PFE" });

    const classe3eme = await Classe.findOne({ annee: "3eme_annee" });
    if (!classe3eme) {
      return res.status(404).json({ error: "Classe 3eme_annee non trouvée" });
    }

    let etudiants = await Etudiant.find({ niveau: classe3eme._id });
    etudiants = shuffleArray(etudiants);

    let enseignants = await Enseignant.find();
    enseignants = shuffleArray(enseignants);

    const paires = generatePaires(enseignants);
    const etudiantAffectes = new Set();
    const encadrantsDisponibles = [...enseignants];
    let juryIndex = 1;
    const affectations = [];

    for (const paire of paires) {
      const [ens1, ens2] = paire;
      const nomsEnseignants = [`${ens1.prenom} ${ens1.nom}`, `${ens2.prenom} ${ens2.nom}`];
      
      // Vérifier que les enseignants ne sont pas déjà dans un autre jury PFE
      const disponibles = await checkEnseignantsDisponibles(nomsEnseignants, "pfe");
      if (!disponibles) continue;

      // Trouver un encadrant différent des membres du jury
      const encadrantIndex = encadrantsDisponibles.findIndex(e => 
        e._id.toString() !== ens1._id.toString() && 
        e._id.toString() !== ens2._id.toString()
      );
      
      if (encadrantIndex === -1) continue;
      
      const encadrant = encadrantsDisponibles[encadrantIndex];
      encadrantsDisponibles.splice(encadrantIndex, 1);
      
      const juryEtudiants = [];
      const etudiantsDisponibles = etudiants.filter(etu => !etudiantAffectes.has(etu._id.toString()));

      // Prendre 2 étudiants maximum
      for (let i = 0; i < Math.min(2, etudiantsDisponibles.length); i++) {
        const etu = etudiantsDisponibles[i];
        juryEtudiants.push({
          nom: `${etu.prenom} ${etu.nom}`,
          classe: etu.classe
        });
        etudiantAffectes.add(etu._id.toString());
      }

      if (juryEtudiants.length > 0) {
        const affectation = new Affectation({
          juryLabel: `Jury PFE ${juryIndex}`,
          enseignants: nomsEnseignants,
          encadrant: `${encadrant.prenom} ${encadrant.nom}`,
          salle: generateSalle(),
          stageType: "PFE",
          etudiants: juryEtudiants
        });

        await affectation.save();
        affectations.push(affectation);
        juryIndex++;
      }

      if (etudiantAffectes.size === etudiants.length) break;
    }

    res.status(201).json(affectations);
  } catch (err) {
    console.error('Erreur génération affectations PFE:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route GET pour les affectations PFE
router.get('/pfe', async (req, res) => {
  try {
    const affectations = await Affectation.find({ stageType: "PFE" });
    res.json(affectations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Dans affectation.js, ajoutez cette route avant module.exports
router.get('/affected-students/count', async (req, res) => {
  try {
    const affectations = await Affectation.find();
    let count = 0;
    
    affectations.forEach(affectation => {
      count += affectation.etudiants.length;
    });
    
    res.json(count);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;