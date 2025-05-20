const express =require("express");
const mongoose=require("mongoose");
const authRoutes=require("./routes/auth.js");
const EnseigRoutes=require("./routes/enseignant.js");
const EtudiantRoutes=require("./routes/etudiant.js");
const classRoutes=require("./routes/classe.js");
const affectRoutes=require('./routes/affectation.js');
const app=express();
const cors=require("cors");
const port=3000;
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("server running");
})

app.use("/auth",authRoutes);
app.use("/enseignant",EnseigRoutes);
app.use("/etudiant",EtudiantRoutes);
app.use("/classe",classRoutes);
app.use('/api/affectation',affectRoutes );

async function connectDB(){
    await mongoose.connect("mongodb://localhost:27017",{
        dbName:'Gestion_stage',
    });
    //await mongoose.connect("mongodb+srv://khaled:2762004.@cluster0.7lq3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
     //   dbName:'Gestion_stage',
    //});
    console.log("mongodb connected");
}
connectDB().catch((err)=>{
    console.error(err);
})


app.listen(port,()=>{
    console.log("server run on port",port);
})