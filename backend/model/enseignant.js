const mongoose=require("mongoose");
const enseignantSchema=new mongoose.Schema({
    email:String,
    nom:String,
    prenom:String,
})
const Enseignant=mongoose.model("enseignants",enseignantSchema);
module.exports=Enseignant;