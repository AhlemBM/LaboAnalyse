const { Rendezvous, Test, User } = require('../models');
const sequelize = require('sequelize');

const createRendezvous = async (req, res) => {
    try {
        const { nom, prenom, numTel, adresse, dateHeure, notes, testId, lieu, userId } = req.body;

        if (!nom || !prenom || !numTel || !adresse || !dateHeure || !testId || !lieu || !userId) {
            return res.status(400).json({ message: "Nom, Prénom, NumTel, Adresse, DateHeure, TestId, Lieu et UserId sont requis." });
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
            lieu,
            userId,  // Ajouter userId à la création du rendez-vous
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

// Récupérer un rendez-vous par son ID
const getRendezvousById = async (req, res) => {
    const { id } = req.params;
    try {
        const rendezvous = await Rendezvous.findByPk(id, {
            include: [{ model: Test, as: 'test' }, { model: User, as: 'user' }]
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

// Récupérer tous les rendez-vous
const getAllRendezvous = async (req, res) => {
    try {
        const rendezvousList = await Rendezvous.findAll({
            include: [{ model: Test, as: 'test' }, { model: User, as: 'user' }]
        });
        res.status(200).json(rendezvousList);
    } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mise à jour du rendez-vous
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

// Suppression d'un rendez-vous
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

// Récupérer les rendez-vous d'un patient par son numéro de téléphone
const getRendezvousByPatient = async (req, res) => {
    const { userId } = req.params;

    try {
        const rendezvous = await Rendezvous.findAll({
            where: { userId },
            include: [
                {
                    model: Test,
                    as: 'test', // 👈 très important si tu as mis "as: 'test'" dans l'association
                    attributes: ['nom']
                }
            ],
            order: [['dateHeure', 'ASC']]
        });

        res.status(200).json(rendezvous);
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les rendez-vous de l'administrateur (regroupés par mois)
const getAllRendezvousAdmin = async (req, res) => {
    try {
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

// Méthode pour récupérer les rendez-vous validés
// Récupérer les rendez-vous validés d'un utilisateur
const getValidRendezvous = async (req, res) => {
    const { userId } = req.params;  // Assurez-vous d'obtenir le userId du paramètre ou de la session

    try {
        // Requête pour récupérer les rendez-vous validés de l'utilisateur
        const validRendezvous = await Rendezvous.findAll({
            where: {
                userId: userId,  // Utiliser l'ID de l'utilisateur pour filtrer
                statut: 'validé'  // Filtrer par le statut validé
            },
            include: [
                {
                    model: Test,
                    as: 'test',  // Assurez-vous que vous avez une association avec le modèle Test
                    attributes: ['nom']
                }
            ],
            order: [['dateHeure', 'ASC']]  // Optionnel : Trier par date ascendante
        });

        res.status(200).json(validRendezvous);  // Retourner les rendez-vous validés
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous validés:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


module.exports = {
    createRendezvous,
    getRendezvousById,
    getAllRendezvous,
    updateRendezvous,
    deleteRendezvous,
    getRendezvousByPatient,
    getAllRendezvousAdmin,
    getValidRendezvous
};
