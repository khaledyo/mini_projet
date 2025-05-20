const mongoose=require("mongoose");
const stageSchema=new mongoose.Schema({
    type:String,
    sujet:String,
    nom_entreprise:String,
    etudiantId:{ type: mongoose.Schema.Types.ObjectId, ref: 'etudiants' },
    enseignantId:{ type: mongoose.Schema.Types.ObjectId, ref: 'enseignants' },
})
const Stage =mongoose.model("etudiants",etudiantSchema);
module.exports=Stage;