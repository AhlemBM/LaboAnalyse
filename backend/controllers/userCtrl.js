
const { User } = require("../models");
//getProfile
const getProfile = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur depuis le token JWT
        const userId = req.params.id;

        // Chercher l'utilisateur dans la base de données
        const user = await User.findByPk(userId, {
            attributes: ["id", "nom", "prenom", "email", "telephone", "dateNaissance"], // Exclure le mot de passe
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
//getAll
//getById



module.exports = { getProfile };


