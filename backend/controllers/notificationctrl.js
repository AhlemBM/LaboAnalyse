const { Notification } = require('../models');

const notificationController = {
    // ➕ Créer une notification
    createNotification: async (req, res) => {
        try {
            const { userId, message } = req.body;
            if (!userId || !message) {
                return res.status(400).json({ message: "userId et message sont requis." });
            }

            const notification = await Notification.create({
                userId,
                message,
                lu: false,
                date: new Date()
            });

            res.status(201).json(notification);
        } catch (error) {
            console.error("Erreur lors de la création de la notification :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    // 🔔 Récupérer les notifications d’un utilisateur
    getUserNotifications: async (req, res) => {
        try {
            const { userId } = req.params;
            const notifications = await Notification.findAll({
                where: { userId },
                order: [['date', 'DESC']]
            });

            res.status(200).json(notifications);
        } catch (error) {
            console.error("Erreur lors de la récupération des notifications :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    // ✅ Marquer une notification comme lue
    markAsRead: async (req, res) => {
        try {
            const { id } = req.params;
            const notification = await Notification.findByPk(id);

            if (!notification) {
                return res.status(404).json({ message: "Notification non trouvée." });
            }

            notification.lu = true;
            await notification.save();

            res.status(200).json({ message: "Notification marquée comme lue." });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la notification :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    // 🗑️ Supprimer une notification
    deleteNotification: async (req, res) => {
        try {
            const { id } = req.params;
            const notification = await Notification.findByPk(id);

            if (!notification) {
                return res.status(404).json({ message: "Notification non trouvée." });
            }

            await notification.destroy();
            res.status(200).json({ message: "Notification supprimée avec succès." });
        } catch (error) {
            console.error("Erreur lors de la suppression de la notification :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = notificationController;
