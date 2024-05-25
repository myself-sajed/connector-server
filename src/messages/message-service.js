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

    }
}


export default messageService