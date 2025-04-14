const multer = require('multer');
const path = require('path');
const { Kit } = require('../models');

// Configuration de Multer pour l'upload des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Dossier où les fichiers seront stockés
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Création d'un nom de fichier unique
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Créer un nouveau Kit
const createKit = async (req, res) => {
    try {
        const { nom, description, prix, stock } = req.body;
        let img = '';

        // Vérifier si l'image est présente
        if (req.file) {
            img = req.file.path; // Sauvegarde le chemin de l'image téléchargée
        }

        // Création du Kit avec ou sans image
        const newKit = await Kit.create({ nom, description, prix, stock, img });
        res.status(201).json({ message: "Kit créé avec succès", kit: newKit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du Kit", error });
    }
};

// Obtenir tous les Kits
const getAllKits = async (req, res) => {
    try {
        const kits = await Kit.findAll();
        res.status(200).json(kits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des Kits", error });
    }
};

// Obtenir un Kit par son ID
const getKitById = async (req, res) => {
    try {
        const kitId = req.params.id;
        const kit = await Kit.findByPk(kitId);
        if (!kit) {
            return res.status(404).json({ message: "Kit non trouvé" });
        }
        res.status(200).json(kit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération du Kit", error });
    }
};

// Mettre à jour un Kit par son ID
const updateKit = async (req, res) => {
    try {
        const kitId = req.params.id;
        const { nom, description, prix, stock } = req.body;
        const kit = await Kit.findByPk(kitId);

        if (!kit) {
            return res.status(404).json({ message: "Kit non trouvé" });
        }

        // Vérification et mise à jour des champs
        kit.nom = nom || kit.nom;
        kit.description = description || kit.description;
        kit.prix = prix || kit.prix;
        kit.stock = stock || kit.stock;

        // Si une nouvelle image est envoyée, on met à jour l'image
        if (req.file) {
            kit.img = req.file.path;
        }

        await kit.save();
        res.status(200).json({ message: "Kit mis à jour avec succès", kit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du Kit", error });
    }
};

// Supprimer un Kit par son ID
const deleteKit = async (req, res) => {
    try {
        const kitId = req.params.id;
        const kit = await Kit.findByPk(kitId);

        if (!kit) {
            return res.status(404).json({ message: "Kit non trouvé" });
        }

        await kit.destroy();
        res.status(200).json({ message: "Kit supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression du Kit", error });
    }
};

module.exports = {
    createKit,
    getAllKits,
    getKitById,
    updateKit,
    deleteKit,
    upload  // Ajouter l'upload pour l'utilisation dans les routes
};
