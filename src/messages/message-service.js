import Chat from "../chats/chat-model.js"
import Message from "./message-model.js"


const messageService = {
    getMessages: async (chatId) => {
        try {
            const messages = await Message.find({ chatId }).lean().populate("author").exec();
            return messages || []
        } catch (error) {
            console.log('error occured in getting messages:', error)
            return []
        }

    },

    editMessage: async (messageId, messageContent, chatId) => {
        const message = await Message.findOneAndUpdate({ _id: messageId }, { text: messageContent, isEdited: true, status: "sent" }, { new: true }).populate("author").exec()
        const chat = await Chat.findOne({ _id: chatId }).select("-messages")

        let lastMessage = null

        if (chat.lastMessage.toString() === message._id.toString()) {
            lastMessage = message
        }

        const userIds = message.interactedUsers.map(userId => userId.toString())

        return { message, lastMessage, userIds, operationalMessage: message }
    }
}


export default messageService