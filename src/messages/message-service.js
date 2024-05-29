import Chat from "../chats/chat-model.js"
import Message from "./message-model.js"


const messageService = {
    getMessages: async (chatId) => {
        try {
            const messages = await Message.find({ chatId }).lean().populate("author").populate("messageRepliedTo").exec();
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
    },


    deleteMessage: async (message) => {
        try {
            const chat = await Chat.findOne({ _id: message.chatId }).populate("lastMessage").exec()
            await Message.findOneAndDelete({ _id: message._id })
            let wasLastMessage = false

            if (message._id.toString() === chat.lastMessage._id.toString()) {
                const searchLastMessage = await Message.findOne({ chatId: message.chatId }).sort({ updatedAt: -1 }).exec()
                chat.lastMessage = searchLastMessage
                await chat.save()
                wasLastMessage = true
            }
            return { status: true, chat, wasLastMessage }
        } catch (error) {
            console.log(error)
            return { status: false }
        }
    }
}


export default messageService