const mongoose=require("mongoose");
const tokenSchema=new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    token:String,
    createdAt:{type:Date,default:Date.now,expires:300}
})
const Token=mongoose.model("Token",tokenSchema);
module.exports=Token;