import Chat from "../chats/chat-model.js"
import Message from "./message-model.js"


const messageService = {
    getMessages: async (chatId, meId) => {

        // check if chat exists
        const chat = await Chat.findOne({ _id: chatId })
        if (chat) {
            const messages = await Message.find({ chatId: chatId }).populate("author").exec()

            if (!messages) {
                return []
            }

            return messages
        } else {

            const chat = await Chat.findOne({ users: { $all: [meId, chatId], $size: 2 } })

            if (chat) {
                const messages = await Message.find({ chatId: chat._id }).populate("author").exec()

                if (!messages) {
                    return []
                }

                return messages
            }

            return []
        }
    }
}


export default messageService