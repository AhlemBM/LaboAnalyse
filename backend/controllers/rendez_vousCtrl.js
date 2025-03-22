const { Rendezvous, User } = require('../models');
const createRendezvous = async (req, res) => {
    try {
        // Extraction des données du corps de la requête
        const { patientId, dateHeure, notes } = req.body;

        // Vérification si les champs nécessaires sont présents
        if (!patientId || !dateHeure) {
            return res.status(400).json({ message: "PatientId et DateHeure sont requis." });
        }

        // Création du rendez-vous
        const rendezvous = await Rendezvous.create({
            patientId,
            dateHeure,
            notes,
            statut: 'en attente', // Statut initial
        });

        // Retourner une réponse de succès
        console.log("Rendez-vous créé avec succès :", rendezvous);
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
                { model: User, as: 'patient' },
                { model: User, as: 'medecin' }
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
const updateRendezvousStatus = async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;
    try {
        const rendezvous = await Rendezvous.findByPk(id);

        if (!rendezvous) {
            return res.status(404).json({ message: 'Rendez-vous introuvable' });
        }

        rendezvous.statut = statut;
        await rendezvous.save();
        res.status(200).json(rendezvous);
    } catch (err) {
        console.error('Erreur lors de la mise à jour du statut', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


const getAllRendezvous = async (req, res) => {
    try {
        const rendezvousList = await Rendezvous.findAll({
            include: [
                { model: User, as: 'patient' },  // Inclure le patient
                { model: User, as: 'medecin' },  // Inclure le médecin
            ]
        });
        res.status(200).json(rendezvousList);
    } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getRendezvousByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;  // Récupérer l'ID du patient depuis les paramètres
        const rendezvous = await Rendezvous.findAll({
            where: { patientId },
            include: [
                { model: User, as: "patient" },  // Inclure les informations du patient
            ]
        });

        if (!rendezvous.length) {
            return res.status(404).json({ message: "Aucun rendez-vous trouvé pour ce patient." });
        }

        res.status(200).json(rendezvous);
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
const updateRendezvous = async (req, res) => {
    try {
        const { id } = req.params;  // Récupérer l'ID du rendez-vous depuis les paramètres
        const { dateHeure, notes, statut } = req.body;  // Récupérer les nouvelles informations

        const rendezvous = await Rendezvous.findByPk(id);  // Trouver le rendez-vous par ID
        if (!rendezvous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        // Mettre à jour les informations du rendez-vous
        rendezvous.dateHeure = dateHeure || rendezvous.dateHeure;
        rendezvous.notes = notes || rendezvous.notes;
        rendezvous.statut = statut || rendezvous.statut;

        await rendezvous.save();  // Sauvegarder les modifications

        res.status(200).json({ message: "Rendez-vous mis à jour avec succès", rendezvous });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du rendez-vous:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
const deleteRendezvous = async (req, res) => {
    try {
        const { id } = req.params;  // Récupérer l'ID du rendez-vous depuis les paramètres
        const rendezvous = await Rendezvous.findByPk(id);  // Trouver le rendez-vous par ID

        if (!rendezvous) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        await rendezvous.destroy();  // Supprimer le rendez-vous de la base de données

        res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du rendez-vous:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


module.exports = {
    createRendezvous,
    getAllRendezvous,
    getRendezvousById,
    updateRendezvousStatus,
    getRendezvousByPatientId,
    updateRendezvous,
    deleteRendezvous




}
