const { Panier, Kit } = require('../models');

const panierController = {
    // Ajouter un kit au panier
    addToCart: async (req, res) => {
        try {
            const { userId, kitId, quantite } = req.body;

            const kit = await Kit.findByPk(kitId);
            if (!kit) return res.status(404).json({ message: "Kit not found" });

            const panierItem = await Panier.create({ userId, kitId, quantite, status: "en cours" });
            res.status(201).json({ message: "Kit added to cart", panierItem });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error adding to cart", error });
        }
    },

    // Récupérer le panier d'un utilisateur
    getUserCart: async (req, res) => {
        try {
            const { userId } = req.params;
            const panier = await Panier.findAll({ where: { userId, status: "en cours" }, include: Kit });

            res.status(200).json(panier);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching cart", error });
        }
    },

    // Supprimer un kit du panier
    removeFromCart: async (req, res) => {
        try {
            const { id } = req.params;
            const panierItem = await Panier.findByPk(id);

            if (!panierItem) return res.status(404).json({ message: "Cart item not found" });

            await panierItem.destroy();
            res.status(200).json({ message: "Kit removed from cart" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error removing item", error });
        }
    },

    // Vider le panier d'un utilisateur
    clearCart: async (req, res) => {
        try {
            const { userId } = req.params;
            await Panier.destroy({ where: { userId, status: "en cours" } });

            res.status(200).json({ message: "Cart cleared successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error clearing cart", error });
        }
    }
};

module.exports = panierController;
