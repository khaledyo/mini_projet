const mongoose = require('mongoose');

const EtudiantAffecteSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  classe: { type: String, required: true }
});

const AffectationSchema = new mongoose.Schema({
  juryLabel: {
    type: String,
    required: true
  },
  enseignants: {
    type: [String],
    required: true
  },
  encadrant: {  // Nouveau champ pour PFE
    type: String
  },
  salle: {
    type: String,
    required: true
  },
  stageType: {
    type: String,
    required: true,
    enum: ['initiation', 'perfectionnement', 'PFE']
  },
  etudiants: {
    type: [{
      nom: String,
      classe: String
    }],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Affectation', AffectationSchema);
