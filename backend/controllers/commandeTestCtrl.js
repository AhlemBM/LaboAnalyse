const {User, CommandeDetail,Kit,Commande , Notification} =require("../models")


const getAllCommandes = async (req, res) => {
    try {
        const commandes = await Commande.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['nom', 'prenom']
                },
                {
                    model: CommandeDetail,
                    include: [
                        {
                            model: Kit,
                            as: 'kit',
                            attributes: ['nom', 'image', 'prix']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(commandes);
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};



const updateCommandeStatut = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        const statutsValides = ['en attente', 'en préparation', 'livrée', 'annulée'];
        if (!statutsValides.includes(statut)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        const commande = await Commande.findByPk(id);
        if (!commande) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        commande.statut = statut;
        await commande.save();

        // 🔔 Créer une notification
        await Notification.create({
            userId: commande.userId,
            message: `Votre commande #${commande.id} est maintenant "${statut}".`
        });

        res.status(200).json({ message: "Statut mis à jour et notification envoyée", commande });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
const getMesCommandes = async (req, res) => {
    try {
        const userId = req.params.id;

        const commandes = await Commande.findAll({
            where: { userId },
            include: [
                {
                    model: CommandeDetail,
                    include: [{
                        model: Kit,
                        as: 'kit',
                        attributes: ['nom', 'image', 'prix']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(commandes);
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = {

    getAllCommandes,
    updateCommandeStatut,
    getMesCommandes
};
