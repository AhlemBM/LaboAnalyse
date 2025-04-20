const { User,Panier, Kit , Commande, CommandeDetail} = require('../models');

const { Sequelize } = require('sequelize');
const panierController = {
    // Ajouter un kit au panier
    addToCart: async (req, res) => {
        try {
            const {userId, kitId, quantite} = req.body;

            const kit = await Kit.findByPk(kitId);
            if (!kit) return res.status(404).json({message: "Kit not found"});

            const panierItem = await Panier.create({userId, kitId, quantite, status: "en cours"});
            res.status(201).json({message: "Kit added to cart", panierItem});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Error adding to cart", error});
        }
    },

    // Récupérer le panier d'un utilisateur
    getUserCart: async (req, res) => {
        try {
            const {userId} = req.params;
            const panier = await Panier.findAll({
                where: {userId, status: "en cours"},
                include: [{
                    model: Kit,   // On inclut le modèle Kit
                    as: 'kit'     // Le nom de l'association (associée dans le modèle Panier)
                }]
            });

            res.status(200).json(panier);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Error fetching cart", error});
        }
    },

    // Supprimer un kit du panier
    removeFromCart: async (req, res) => {
        try {
            const {id} = req.params;
            const panierItem = await Panier.findByPk(id);

            if (!panierItem) return res.status(404).json({message: "Cart item not found"});

            await panierItem.destroy();
            res.status(200).json({message: "Kit removed from cart"});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Error removing item", error});
        }
    },

    // Vider le panier d'un utilisateur
    clearCart: async (req, res) => {
        try {
            const {userId} = req.params;
            await Panier.destroy({where: {userId, status: "en cours"}});

            res.status(200).json({message: "Cart cleared successfully"});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Error clearing cart", error});
        }
    },
    updateQuantity: async (req, res) => {
        try {
            const {panierId} = req.params; // ID du panier à modifier
            const {quantite} = req.body; // Nouvelle quantité

            // Vérifiez si la quantité est valide
            if (quantite < 1) {
                return res.status(400).json({message: "La quantité doit être supérieure ou égale à 1."});
            }

            // Trouver le panier avec l'ID donné et mettre à jour la quantité
            const panierItem = await Panier.findByPk(panierId);

            if (!panierItem) {
                return res.status(404).json({message: "Article du panier non trouvé."});
            }

            // Mise à jour de la quantité
            panierItem.quantite = quantite;

            await panierItem.save(); // Sauvegarder les modifications dans la base de données

            res.status(200).json(panierItem); // Retourner l'élément mis à jour
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Erreur lors de la mise à jour de la quantité", error});
        }
    },


    validerCommande :async (req, res) => {
        try {
            const {userId, adresse} = req.body;

            // 1. Récupérer les éléments du panier de l'utilisateur
            const panierItems = await Panier.findAll({
                where: {userId, status: 'en cours'},
                include: [{model: Kit, as: 'kit'}]
            });

            if (!panierItems.length) {
                return res.status(400).json({message: "Aucun article dans le panier à valider."});
            }

            // 2. Vérifier les stocks
            for (const item of panierItems) {
                if (item.kit.stock < item.quantite) {
                    return res.status(400).json({
                        message: `Stock insuffisant pour le kit "${item.kit.nom}"`
                    });
                }
            }

            // 3. Créer la commande
            const commande = await Commande.create({
                userId,
                adresse,
                dateCommande: new Date(),
                statut: 'en attente'
            });

            // 4. Créer les détails de la commande
            for (const item of panierItems) {
                await CommandeDetail.create({
                    commandeId: commande.id,
                    kitId: item.kitId,
                    quantite: item.quantite,
                    prixUnitaire: item.kit.prix
                });

                // 5. Mettre à jour le stock du produit
                item.kit.stock -= item.quantite;
                await item.kit.save();

                // 6. Mettre à jour le panier (statut validée)
                item.status = 'validée';
                await item.save();
            }

            return res.status(200).json({
                message: "Commande validée avec succès",
                commandeId: commande.id
            });

        } catch (error) {
            console.error("Erreur lors de la validation de la commande :", error);
            res.status(500).json({message: "Erreur lors de la validation de la commande", error});
        }
    },
    getCommandesByUser : async (req, res) => {
        try {
            const { userId } = req.params;
            const commandes = await Commande.findAll({
                where: { userId },
                include: [{
                    model: CommandeDetail,
                    include: ['kit'] // si l'association kit existe dans CommandeDetail
                }]
            });

            res.status(200).json(commandes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des commandes", error });
        }
    },




    getAllCommandes :async (req, res) => {
        try {
            const commandes = await Commande.findAll({
                include: [
                    {
                        model: CommandeDetail,
                        include: [{
                            model: Kit,
                            as: 'kit' // Utiliser l'alias défini dans CommandeDetail
                        }]
                    },
                    {
                        model: User,
                        attributes: ['nom', 'prenom']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json(commandes);
        } catch (error) {
            console.error("Erreur lors de la récupération des commandes", error);
            res.status(500).json({ message: "Erreur lors de la récupération des commandes", error });
        }
    },
    // Confirmer une commande
    confirmerCommande: async (req, res) => {
        const id = req.params.id;
        try {
            const commande = await Commande.findByPk(id);
            if (!commande) return res.status(404).json({ message: 'Commande introuvable' });

            commande.statut = 'confirmée';
            await commande.save();

            res.status(200).json({ message: 'Commande confirmée avec succès' });
        } catch (error) {
            console.error("Erreur lors de la confirmation de la commande", error);
            res.status(500).json({ message: "Erreur lors de la confirmation" });
        }
    },



    getConfirmedCommandesStats: async (req, res) => {
        try {
            const stats = await Commande.findAll({
                attributes: [
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'mois'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'nombre']
                ],
                where: { statut: 'confirmée' },
                group: ['mois'],
                order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
            });

            res.status(200).json(stats);
        } catch (error) {
            console.error("Erreur lors de la récupération des stats", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }

};

module.exports = panierController;
