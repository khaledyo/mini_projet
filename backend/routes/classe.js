const express = require("express"); 
const Classe = require("../model/classe.js");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const classes = await Classe.find();
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


router.delete('/:annee/classe/:classe', async (req, res) => {
    try {
        const { annee, classe } = req.params;
        const niveau = await Classe.findOne({ annee });

        if (!niveau) return res.status(404).json({ message: 'Niveau non trouvé' });

        // Supprime la classe du tableau
        niveau.classes = niveau.classes.filter(c => c !== classe);
        await niveau.save();
        res.json({ message: 'Classe supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

router.delete('/:annee', async (req, res) => {
    try {
        const { annee } = req.params;
        await Classe.deleteOne({ annee });
        res.json({ message: 'Niveau supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
router.post("", async (req, res) => {
    try {
        const { annee, classe } = req.body;

        if (!annee || !classe || !classe.trim()) {
            return res.status(400).json({ message: "L'année et la classe sont nécessaires et ne peuvent pas être vides." });
        }

        let existingClasse = await Classe.findOne({ annee });

        if (existingClasse) {
            // Vérifier si la classe existe déjà
            const classExists = existingClasse.classes.some(existingClasse => existingClasse.toLowerCase() === classe.trim().toLowerCase());
            if (classExists) {
                return res.status(400).json({ message: "La classe existe déjà." });
            }

            // Ajouter la classe à l'année existante
            existingClasse = await Classe.findOneAndUpdate(
                { annee },
                { $addToSet: { classes: classe.trim() } },
                { new: true }
            );

            return res.json({ message: "Classe ajoutée avec succès", existingClasse });
        }

        // Créer une nouvelle année avec la classe
        const newClasse = new Classe({ annee, classes: [classe.trim()] });
        await newClasse.save();

        res.status(201).json({ message: "Année et classe ajoutées avec succès !", newClasse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:annee', async (req, res) => {
    try {
        const { annee } = req.params;
        const niveau = await Classe.findOne({ annee });

        if (!niveau) {
            return res.status(404).json({ message: 'Niveau non trouvé' });
        }

        res.json(niveau.classes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
