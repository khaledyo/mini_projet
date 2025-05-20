const mongoose = require("mongoose");

const classeSchema = new mongoose.Schema({
    annee: { 
        type: String, 
        required: true, 
        unique: true 
    },
    classes: [{ type: String, required: true, 
        trim: true, 
    }]
});

const Classe = mongoose.model("classes", classeSchema);
module.exports = Classe;
