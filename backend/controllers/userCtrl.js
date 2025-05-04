const { User } = require("../models");


const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId, {
            attributes: ["id", "nom", "prenom", "email", "telephone", "dateNaissance"],
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

// GET /users - Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "nom", "prenom", "email", "telephone", "dateNaissance"],
        });
        res.status(200).json({ users });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// DELETE /users/:id - Supprimer un utilisateur par ID
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        await user.destroy();
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
// PUT /users/:id - Mettre à jour le profil utilisateur
const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { nom, prenom, email, telephone, dateNaissance } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Mise à jour des champs
        user.nom = nom ?? user.nom;
        user.prenom = prenom ?? user.prenom;
        user.email = email ?? user.email;
        user.telephone = telephone ?? user.telephone;
        user.dateNaissance = dateNaissance ?? user.dateNaissance;

        await user.save();

        res.status(200).json({ message: "Profil mis à jour avec succès", user });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


module.exports = {
    getProfile,
    getAllUsers,
    deleteUser,
    updateProfile
};
