const express =require("express");
const router=express.Router();
const Enseignant=require('../model/enseignant.js');
function capitalizePrenom(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
router.post("",async(req,res)=>{
    const cast=req.body;
    let enseignant=new Enseignant({
        nom:cast.nom.toUpperCase(),
        prenom: capitalizePrenom(cast.prenom),
        email:cast.email
    });
    await enseignant.save();
    res.send(enseignant.toObject());
});
router.get("",async(req,res)=>{
    let ge=await Enseignant.find();
    res.send(ge.map(c=>c.toObject()));
});
router.get("/:id",async(req,res)=>{
    let id=req.params['id'];
    let ge=await Enseignant.findById(id);
    res.send(ge.toObject());
});
router.put("/:id",async(req,res)=>{
    let cast=req.body;
    let id=req.params['id'];
    let upd=await Enseignant.findByIdAndUpdate({_id:id},{
        nom:cast.nom.toUpperCase(),
        prenom: capitalizePrenom(cast.prenom),
        email:cast.email
    });
    if(!upd){
        return res.status(404).json({messge:"Enseignant not found "});
    }
    res.send({message:"updated"});
});
router.delete("/:id",async(req,res)=>{
    let id=req.params['id'];
    const del=await Enseignant.findByIdAndDelete({_id:id});
    if(!del){
        return res.status(404).json({messge:"Enseignant not found "});
    }
    res.send({message:"deleted"});
});
module.exports =router;