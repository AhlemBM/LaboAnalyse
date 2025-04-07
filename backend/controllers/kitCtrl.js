const { Kit } = require('../models'); // Importation du modèle Kit

// Créer un nouveau Kit
const createKit = async (req, res) => {
    try {
        const { nom, description, prix, stock, img } = req.body;
        const newKit = await Kit.create({ nom, description, prix, stock, img });
        res.status(201).json({ message: "Kit created successfully", kit: newKit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Kit", error });
    }
};

// Obtenir tous les Kits
const getAllKits = async (req, res) => {
    try {
        const kits = await Kit.findAll();
        res.status(200).json(kits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving Kits", error });
    }
};

// Obtenir un Kit par son ID
const getKitById = async (req, res) => {
    try {
        const kitId = req.params.id;
        const kit = await Kit.findByPk(kitId);
        if (!kit) {
            return res.status(404).json({ message: "Kit not found" });
        }
        res.status(200).json(kit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving Kit", error });
    }
};

// Mettre à jour un Kit par son ID
const updateKit = async (req, res) => {
    try {
        const kitId = req.params.id;
        const { nom, description, prix, stock, img } = req.body;

        const kit = await Kit.findByPk(kitId);
        if (!kit) {
            return res.status(404).json({ message: "Kit not found" });
        }

        kit.nom = nom || kit.nom;
        kit.description = description || kit.description;
        kit.prix = prix || kit.prix;
        kit.stock = stock || kit.stock;
        kit.img = img || kit.img;

        await kit.save();

        res.status(200).json({ message: "Kit updated successfully", kit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating Kit", error });
    }
};

// Supprimer un Kit par son ID
const deleteKit = async (req, res) => {
    try {
        const kitId = req.params.id;
        const kit = await Kit.findByPk(kitId);

        if (!kit) {
            return res.status(404).json({ message: "Kit not found" });
        }

        await kit.destroy();
        res.status(200).json({ message: "Kit deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting Kit", error });
    }
};

module.exports = {
    createKit,
    getAllKits,
    getKitById,
    updateKit,
    deleteKit
};
