const { Test } = require("../models");

// ✅ 1. Ajouter un test
const addTest = async (req, res) => {
    try {
        const { nom, description, prix } = req.body;

        // Vérifier si le test existe déjà
        const existingTest = await Test.findOne({ where: { nom } });
        if (existingTest) {
            return res.status(400).json({ message: "Ce test existe déjà." });
        }

        // Création du test
        const newTest = await Test.create({ nom, description, prix });

        res.status(201).json({ message: "Test ajouté avec succès !", test: newTest });
    } catch (error) {
        console.error("Erreur lors de l'ajout du test :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// ✅ 2. Supprimer un test
const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si le test existe
        const test = await Test.findByPk(id);
        if (!test) {
            return res.status(404).json({ message: "Test non trouvé." });
        }

        await test.destroy();
        res.status(200).json({ message: "Test supprimé avec succès !" });
    } catch (error) {
        console.error("Erreur lors de la suppression du test :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// ✅ 3. Récupérer tous les tests
const getAllTests = async (req, res) => {
    try {
        const tests = await Test.findAll();
        res.status(200).json(tests);
    } catch (error) {
        console.error("Erreur lors de la récupération des tests :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// ✅ 4. Rechercher un test par nom
const getTestByName = async (req, res) => {
    try {
        const { nom } = req.params;

        const test = await Test.findOne({ where: { nom } });
        if (!test) {
            return res.status(404).json({ message: "Test non trouvé." });
        }

        res.status(200).json(test);
    } catch (error) {
        console.error("Erreur lors de la recherche du test par nom :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// ✅ 5. Rechercher un test par ID
const getTestById = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await Test.findByPk(id);
        if (!test) {
            return res.status(404).json({ message: "Test non trouvé." });
        }

        res.status(200).json(test);
    } catch (error) {
        console.error("Erreur lors de la recherche du test par ID :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// ✅ 6. Modifier un test
const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description, prix } = req.body;

        // Vérifier si le test existe
        const test = await Test.findByPk(id);
        if (!test) {
            return res.status(404).json({ message: "Test non trouvé." });
        }

        // Mise à jour du test
        await test.update({ nom, description, prix });

        res.status(200).json({ message: "Test mis à jour avec succès !", test });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du test :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// 🔗 Export des fonctions
module.exports = {
    addTest,
    deleteTest,
    getAllTests,
    getTestByName,
    getTestById,
    updateTest
};
