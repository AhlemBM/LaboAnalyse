const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { Resultat, User, Test } = require("../models");

// Configuration de Multer pour l'upload des fichiers PDF
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage }).single("analyse");

// Ajouter un résultat avec un fichier d'analyse (PDF)
const addResultat = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "Erreur lors de l'upload", err });
        }
        try {
            const { patientId, testId } = req.body;
            if (!req.file) {
                return res.status(400).json({ message: "Fichier d'analyse requis" });
            }

            // Vérifier si l'utilisateur et le test existent
            const userExists = await User.findByPk(patientId);
            const testExists = await Test.findByPk(testId);
            if (!userExists || !testExists) {
                return res.status(404).json({ message: "Utilisateur ou test introuvable" });
            }

            const analysePath = req.file.filename; // Stocker uniquement le nom du fichier
            await Resultat.create({
                patientId,
                testId,
                analyse: analysePath
            });

            res.status(201).json({ message: "Résultat ajouté avec succès" });
        } catch (err) {
            console.error("Erreur lors de l'ajout :", err);
            res.status(500).json({ message: "Erreur serveur" });
        }
    });
};

// Télécharger un fichier d'analyse (PDF)
const downloadanalyse = async (req, res) => {
    try {
        const { id } = req.params;
        const resultat = await Resultat.findByPk(id);
        if (!resultat) {
            return res.status(404).json({ message: "Fichier introuvable" });
        }

        const filePath = path.join(__dirname, "../uploads/", resultat.analyse);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Fichier non trouvé" });
        }

        res.download(filePath, resultat.analyse);
    } catch (error) {
        console.error("Erreur lors du téléchargement :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


const deleteResultat = async (req, res) => {
    try {
        const { id } = req.params;
        const resultat = await Resultat.findByPk(id);

        if (!resultat) {
            return res.status(404).json({ message: "Résultat introuvable" });
        }

        const filePath = path.join(__dirname, "../uploads/", resultat.analyse);

        // Vérifiez si le fichier existe avant de tenter de le supprimer
        if (fs.existsSync(filePath)) {
            // Utilisez la méthode asynchrone pour ne pas bloquer l'exécution
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Erreur lors de la suppression du fichier:", err);
                    return res.status(500).json({ message: "Erreur lors de la suppression du fichier" });
                }

                // Si la suppression du fichier réussit, supprimez le résultat de la base de données
                resultat.destroy()
                    .then(() => {
                        res.status(200).json({ message: "Résultat supprimé avec succès" });
                    })
                    .catch((error) => {
                        console.error("Erreur lors de la suppression du résultat:", error);
                        res.status(500).json({ message: "Erreur lors de la suppression du résultat" });
                    });
            });
        } else {
            // Si le fichier n'existe pas, supprimez seulement le résultat dans la base de données
            await resultat.destroy();
            res.status(200).json({ message: "Résultat supprimé avec succès" });
        }
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
// Obtenir tous les résultats
const getAllResultats = async (req, res) => {
    try {
        const resultats = await Resultat.findAll({
            include: [
                { model: User, as: "patient" },
                { model: Test, as: "test" }
            ]
        });
        res.status(200).json(resultats);
    } catch (err) {
        console.error("Erreur lors de la récupération des résultats :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Obtenir un résultat par ID
const getResultatById = async (req, res) => {
    try {
        const { id } = req.params;
        const resultat = await Resultat.findByPk(id, {
            include: [{ model: User, as: "patient" }, { model: Test, as: "test" }]
        });
        if (!resultat) {
            return res.status(404).json({ message: "Résultat introuvable" });
        }
        res.status(200).json(resultat);
    } catch (error) {
        console.error("Erreur lors de la récupération du résultat :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Récupérer les résultats d'un utilisateur par patientId
const getResultatsByUserId = async (req, res) => {
    try {
        const { patientId } = req.params; // Récupérer l'ID du patient depuis les paramètres de la requête
        if (!patientId) {
            return res.status(400).json({ message: "ID utilisateur requis" });
        }

        const resultats = await Resultat.findAll({
            where: { patientId },
            include: [
                { model: User, as: "patient" },
                { model: Test, as: "test" }
            ]
        });

        if (!resultats.length) {
            return res.status(404).json({ message: "Aucun résultat trouvé pour cet utilisateur." });
        }

        res.status(200).json(resultats);
    } catch (error) {
        console.error("Erreur lors de la récupération des résultats :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = {
    getResultatsByUserId,
    addResultat,
    getAllResultats,
    getResultatById,
    downloadanalyse,
    deleteResultat
};
