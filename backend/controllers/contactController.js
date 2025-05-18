const { Message } = require("../models")

// POST /contact - envoyer un message et notifier l'admin
exports.sendMessage = async (req, res) => {
    const { name, email, message } = req.body;
    const io = req.app.get('io'); // Récupération de l’instance Socket.io

    try {
        // Créer le message
        const newMessage = await Message.create({ name, email, message });

        // Compter les messages non lus
        const unreadCount = await Message.count({ where: { isRead: false } });

        // Envoyer une notification globale avec le total non lu
        io.emit('newMessageNotification', {
            unreadCount,
            id: newMessage.id,
            name: newMessage.name,
            email: newMessage.email,
            message: newMessage.message,
            createdAt: newMessage.createdAt
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'envoi du message." });
    }
};

// GET /admin/messages - Récupérer tous les messages
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({ order: [['createdAt', 'DESC']] });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des messages." });
    }
};

// GET /admin/messages/:id - Récupérer un message par ID + le marquer comme lu
exports.getMessageById = async (req, res) => {
    const { id } = req.params;
    try {
        const message = await Message.findByPk(id);
        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        if (!message.isRead) {
            message.isRead = true;
            await message.save();
        }

        res.json(message);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération du message." });
    }
};


exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        await Message.update({ isRead: true }, { where: { id } });
        res.json({ message: 'Message marqué comme lu' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
};
// GET /admin/messages/:id - Récupérer un message par ID et le marquer comme lu
exports.getMessageById = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findByPk(id);

        if (!message) {
            return res.status(404).json({ error: 'Message non trouvé' });
        }

        if (!message.isRead) {
            message.isRead = true;
            await message.save();
        }

        res.json(message);
    } catch (error) {
        console.error('Erreur getMessageById :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du message.' });
    }
};
