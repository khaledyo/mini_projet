const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const Etudiant = require("../model/etudiant.js");
const Classe = require("../model/classe.js");
const router = express.Router();

// Configuration de Multer pour gérer l'upload de fichiers
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
function capitalizePrenom(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
// Fonction pour générer un numéro unique de 7 chiffres
async function generateUniqueCarteEtudiant() {
    let uniqueNumber;
    let isUnique = false;

    while (!isUnique) {
        uniqueNumber = Math.floor(1000000 + Math.random() * 1000000).toString();
        const existingStudent = await Etudiant.findOne({ carteEtudiant: uniqueNumber });
        if (!existingStudent) {
            isUnique = true;
        }
    }
    return uniqueNumber;
}
router.post("/import_excel", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier n'a été téléchargé." });
        }

        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const studentsData = xlsx.utils.sheet_to_json(sheet);

        let addedStudents = [];

        for (let data of studentsData) {
            const { email, nom, prenom, niveau, classe } = data;

            if (!email || !nom || !prenom || !niveau || !classe) {
                continue;
            }

            const niveauExist = await Classe.findOne({ annee: niveau });
            if (!niveauExist || !niveauExist.classes.includes(classe)) {
                continue;
            }

            const carteEtudiant = await generateUniqueCarteEtudiant();

            const newEtudiant = new Etudiant({
                email,
                nom:nom.toUpperCase(),
                prenom: capitalizePrenom(prenom),
                niveau: niveauExist._id,
                classe,
                carteEtudiant
            });

            await newEtudiant.save();
            addedStudents.push(newEtudiant);
        }

        res.status(201).json({ message: "Importation réussie", addedStudents });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});
router.post("/", async (req, res) => {
    try {
        const { email, nom, prenom, niveau, classe } = req.body;

        if (!email || !nom || !prenom || !niveau || !classe) {
            return res.status(400).json({ message: "Tous les champs sont nécessaires." });
        }

        const niveauExist = await Classe.findOne({ annee: niveau });
        if (!niveauExist) {
            return res.status(404).json({ message: "Niveau non trouvé." });
        }

        if (!niveauExist.classes.includes(classe)) {
            return res.status(400).json({ message: "La classe spécifiée n'existe pas dans ce niveau." });
        }

        // ✅ Générer une carte Étudiant unique
        const carteEtudiant = await generateUniqueCarteEtudiant();

        const newEtudiant = new Etudiant({
            email,
            nom:nom.toUpperCase(),
            prenom: capitalizePrenom(prenom),
            niveau: niveauExist._id,
            classe,
            carteEtudiant // 🔥 Ajout manuel
        });

        await newEtudiant.save();

        res.status(201).json({ message: "Étudiant ajouté avec succès", newEtudiant });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const etudiant = await Etudiant.findById(req.params.id).populate("niveau", "annee");

        if (!etudiant) {
            return res.status(404).json({ message: "Étudiant non trouvé" });
        }

        const response = {
            _id: etudiant._id,
            email: etudiant.email,
            nom: etudiant.nom,
            prenom: etudiant.prenom,
            niveau: etudiant.niveau ? etudiant.niveau.annee : "Niveau non défini",
            carteEtudiant: etudiant.carteEtudiant,
            classe: etudiant.classe,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const etudiants = await Etudiant.find().populate("niveau", "annee");

        const response = etudiants.map(etudiant => ({
            _id: etudiant._id,
            email: etudiant.email,
            nom: etudiant.nom,
            prenom: etudiant.prenom,
            niveau: etudiant.niveau ? etudiant.niveau.annee : "Niveau non défini",
            carteEtudiant: etudiant.carteEtudiant,
            classe: etudiant.classe
        }));

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

// Supprimer un étudiant
router.delete("/:id", async (req, res) => {
    try {
        const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
        if (!etudiant) {
            return res.status(404).json({ message: "Étudiant non trouvé" });
        }
        res.json({ message: "Étudiant supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

// Modifier un étudiant
// Modifier un étudiant
router.put("/:id", async (req, res) => {
    try {
        const { email, nom, prenom, niveau, classe } = req.body;

        // Vérification si le niveau existe
        const niveauExist = await Classe.findOne({ annee: niveau });
        if (!niveauExist) {
            return res.status(404).json({ message: "Niveau non trouvé." });
        }

        // Vérification si la classe existe dans le niveau
        if (!niveauExist.classes.includes(classe)) {
            return res.status(400).json({ message: "La classe spécifiée n'existe pas dans ce niveau." });
        }

        // Mise à jour de l'étudiant en conservant la carteEtudiant existante
        const etudiant = await Etudiant.findByIdAndUpdate(
            req.params.id,
            { email, nom:nom.toUpperCase(),
                prenom: capitalizePrenom(prenom), niveau: niveauExist._id, classe },
            { new: true }
        );

        if (!etudiant) {
            return res.status(404).json({ message: "Étudiant non trouvé" });
        }

        res.json({ message: "Étudiant mis à jour avec succès", etudiant });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});
// Route pour obtenir toutes les classes distinctes
router.get('/classes', async (req, res) => {
  try {
    const classes = await Etudiant.distinct('classe');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
module.exports = router;
