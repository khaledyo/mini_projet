const mongoose = require("mongoose");

const etudiantSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    niveau: { type: mongoose.Schema.Types.ObjectId, ref: "classes", required: true },
    carteEtudiant: { type: String, required: true, unique: true },
    classe: { type: String, required: true }
});




const Etudiant = mongoose.model("etudiants", etudiantSchema);
module.exports = Etudiant;
