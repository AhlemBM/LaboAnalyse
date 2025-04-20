const { Rendezvous, Test } = require('../models');

const createRendezvous = async (req, res) => {
    try {
        const { nom, prenom, numTel, adresse, dateHeure, notes, testId, lieu } = req.body;

        if (!nom || !prenom || !numTel || !adresse || !dateHeure || !testId || !lieu) {
            return res.status(400).json({ message: "Nom, Prénom, NumTel, Adresse, DateHeure, TestId et Lieu sont requis." });
        }

        // Vérification du lieu
        if (!['domicile', 'labo'].includes(lieu)) {
            return res.status(400).json({ message: "Le lieu doit être 'domicile' ou 'labo'." });
        }

        const rendezvous = await Rendezvous.create({
            nom,
            prenom,
            numTel,
            adresse,
            dateHeure,
            notes,
            testId,
            lieu,  // Ajouter le lieu
            statut: 'en attente',
        });

        res.status(201).json({
            message: "Rendez-vous créé avec succès",
            data: rendezvous,
        });
    } catch (err) {
        console.error("Erreur lors de la création du rendez-vous :", err);
        res.status(500).json({ message: "Erreur serveur lors de la création du rendez-vous" });
    }
};

const getRendezvousById = async (req, res) => {
    const { id } = req.params;
    try {
        const rendezvous = await Rendezvous.findByPk(id, {
            include: [
                { model: Test, as: 'test' },
            ]
        });

        if (!rendezvous) {
            return res.status(404).json({ message: "Rendez-vous introuvable" });
        }

        res.status(200).json(rendezvous);
    } catch (err) {
        console.error('Erreur lors de la récupération du rendez-vous', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getAllRendezvous = async (req, res) => {
    try {
        const rendezvousList = await Rendezvous.findAll({
            include: [{ model: Test, as: 'test' }],
        });
        res.status(200).json(rendezvousList);
    } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const updateRendezvous = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, numTel, adresse, dateHeure, notes, statut, testId, lieu } = req.body;

        const rendezvous = await Rendezvous.findByPk(id);
        if (!rendezvous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        // Mise à jour des informations
        rendezvous.nom = nom || rendezvous.nom;
        rendezvous.prenom = prenom || rendezvous.prenom;
        rendezvous.numTel = numTel || rendezvous.numTel;
        rendezvous.adresse = adresse || rendezvous.adresse;
        rendezvous.dateHeure = dateHeure || rendezvous.dateHeure;
        rendezvous.notes = notes || rendezvous.notes;
        rendezvous.statut = statut || rendezvous.statut;
        rendezvous.testId = testId || rendezvous.testId;
        if (lieu) {
            if (!['domicile', 'labo'].includes(lieu)) {
                return res.status(400).json({ message: "Le lieu doit être 'domicile' ou 'labo'." });
            }
            rendezvous.lieu = lieu;
        }

        await rendezvous.save();

        res.status(200).json({ message: "Rendez-vous mis à jour avec succès", rendezvous });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du rendez-vous:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const deleteRendezvous = async (req, res) => {
    try {
        const { id } = req.params;
        const rendezvous = await Rendezvous.findByPk(id);

        if (!rendezvous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        await rendezvous.destroy();

        res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du rendez-vous:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getRendezvousByPatient = async (req, res) => {
    try {
        const { numTel } = req.params;

        // Vérifier si le numéro de téléphone correspond à l'utilisateur connecté
        if (numTel !== req.user.numTel) {
            return res.status(403).json({ message: "Accès interdit : vous ne pouvez voir que vos propres rendez-vous." });
        }

        const rendezvous = await Rendezvous.findAll({
            where: { numTel },
            include: [{ model: Test, as: 'test' }],
        });

        if (!rendezvous.length) {
            return res.status(404).json({ message: "Aucun rendez-vous trouvé pour ce numéro." });
        }

        res.status(200).json(rendezvous);
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
const getAllRendezvousAdmin = async (req, res) => {
    try {
        // Récupérer tous les rendez-vous et les regrouper par mois
        const rendezvousList = await Rendezvous.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('dateHeure'), '%Y-%m'), 'month'], // format 'YYYY-MM'
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'] // compter le nombre de rendez-vous par mois
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('dateHeure'), '%Y-%m')],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('dateHeure'), '%Y-%m'), 'ASC']],
            include: [{ model: Test, as: 'test' }]
        });

        res.status(200).json(rendezvousList);
    } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


module.exports = {
    getRendezvousByPatient,
    createRendezvous,
    getAllRendezvous,
    getRendezvousById,
    updateRendezvous,
    deleteRendezvous,
    getAllRendezvousAdmin
};
