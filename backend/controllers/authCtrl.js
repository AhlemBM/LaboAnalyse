const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const { User } = require("../models");

//register
const register= async(req,res)=>{
    try{
        const { nom, prenom, email, motDePasse, telephone, dateNaissance } = req.body;

        // Vérifier si l'email existe déjà
        const UserExiste = await User.findOne({ where: { email } });
        if (UserExiste) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(motDePasse, salt);

        // Création du User
        const user = await User.create({
            nom,
            prenom,
            email,
            motDePasse: hashedPassword,
            telephone,
            dateNaissance,
            role:"patient"
        });

        res.status(201).json({ message: "Inscription réussie !", user });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
}
//login
const login = async(req,res)=>{
    try {
        const {email,mdp} =req.body
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect." });
        }
        const isMatch= await bcrypt.compare(mdp,user.motDePasse)
        if(!isMatch){
            return res.status(400).json({message:"email or mdp incorrect"})
        }

        //générer un token JWT
        const token =  jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.status(200).json({
            message:"connexion reussie",
            token,
            user:{
                id:user.id,
                nom:user.nom,
                prenom:user.prenom,
                email:user.email,
                telephone :user.telephone,
                role:user.role
            }
        })
    }catch (error){
        console.error("erorr lors de la connexion",error)
        res.status(500).json({message:"err"})
    }
}
//logout

module.exports = {register,login}
