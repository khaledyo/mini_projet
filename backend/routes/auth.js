const express =require("express");
const router=express.Router();
const User=require("../model/user.js");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt=require('jsonwebtoken');
const UserToken=require("../model/UserToken.js");
const authMiddleware = require("../middleware/authMiddleware.js");
router.post("/register", async (req, res) => {
    try {
        let { email, password,username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: "Provide email and password" });
        }
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        let user = new User({
            email,
            password: hashPassword,
            username
        });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    let model = req.body;
    
    if (model.email && model.password) {
      try {
        const user = await User.findOne({ email: model.email });
        if (!user) {
          return res.status(400).json({ message: "Email or password is incorrect" });
        }
        const isTheSame = await bcrypt.compare(model.password, user.password);
        if (isTheSame) {
          const token = jwt.sign({
            id: user._id,
            email: user.email,
            username: user.username
          }, "secret", {
            expiresIn: "3h",
          });
          return res.json({
            token,
            user: {
              id: user._id,
              email: user.email,
              username: user.username
            },
          });
        } else {
          return res.status(400).json({ message: "Email or password is incorrect" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      return res.status(400).json({ message: "Please provide both email and password" });
    }
  });

router.post("/send-email",async(req,res)=>{
    const {email}=req.body;
    const user=await User.findOne({email: email});
    if(!user){
        return  res.status(400).json({message:"user not found"});
    }
    const payload={
        email:user.email
    }
    
    const token=jwt.sign(payload,"secret",{expiresIn:"300s"});
    const newToken=new UserToken({
        userId:user._id,
        token:token
    });
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "khaledyounes145@gmail.com", 
          pass: "fuob ixby jrua drlh",
        },
      });
      const mailOptions = {
        from: "khaledyounes145@gmail.com",
        to: email, 
        subject: "réinitialiser le mot de passe", 
        html: `<html><head><style type="text/css">
                body {
                    margin: 0;
                }
                table {
                    border-spacing: 0;
                    width: 100%;
                }
                td {
                    padding: 0;
                    text-align: center;
                }
                .wrapper {
                    background-color: #e1e5e8;
                    padding: 20px 0;
                }
                .main {
                    max-width: 600px;
                    margin: auto;
                    background-color: #fff;
                    color: #44413d;
                    font-family: 'Poppins', Arial, sans-serif;
                    padding: 20px;
                    border-radius: 8px;
                }
                .button {
                    background-color: #4363b5;
                    color: white;
                    padding: 14px 20px;
                    border: none;
                    cursor: pointer;
                    border-radius: 4px;
                    text-decoration: none;
                    display: inline-block;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <center class="wrapper">
                <table class="main">
                    <tr>
                        <td>
                            <img src="https://media.istockphoto.com/id/1412092597/vector/reset-password-action.jpg?s=612x612&w=0&k=20&c=CiD0trFMObHdQVNWU-zbSzB2kJXgBylzz33hwtV7KRc="  width="100%" style="max-width: 600px;" alt="">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h2>Mot de passe oublié ?</h2>
                            <h5 style="font-size: 17px; font-weight: 400; margin:0;">Demande de réinitialisation de mot de passe.</h5>
                            <p style="font-size: 16px; line-height: 28px; margin: 15px 0;">Pour compléter le processus, cliquez sur le bouton ci-dessous :</p>
                            <a href="http://localhost:4200/reset/${token}" class="button"><p style="color: white;"> Réinitialiser le mot de passe</p></a>
                            <p style="margin-top: 20px;">Veuillez noter que ce lien est valide uniquement pendant <strong>5 minutes</strong>.</p>
                        </td>
                    </tr>
                </table>
            </center>
        </body>
        </html>`, };
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return res.status(500).json({ message: "Erreur lors de l'envoi de l'e-mail." });
        } else {
          return res.status(200).json({ message: "E-mail envoyé avec succès !" });
        }
      });
    });
router.post('/reset-password',async(req,res)=>{
    let model=req.body;
    jwt.verify(model.token,'secret',async(err,data)=>{
        if(err){
            return res.status(400).json({message:"Le lien est expiré"});
        }else{
            const response=data;
            const user=await User.findOne({email: response.email});
            const encrypt=await bcrypt.hash(model.password,10);
            user.password=encrypt;
            try{
                const updateUser=await User.findByIdAndUpdate({
                    _id:user._id},
                    {$set:user},
                    {new:true}
                )
                return res.send({message:"Mot de passe changer avec succes"});
            }catch(error){
                return res.status(500).json({message:"error lors de changer Mot de passe"});
            }
        }
    })
});
router.put("/reset", authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id; // ✅ Correction : Maintenant req.user.id est défini !

    if (!password) {
      return res.status(400).json({ message: "Veuillez entrer un nouveau mot de passe" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "Le nouveau mot de passe doit être différent de l'ancien" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});
    
module.exports=router;