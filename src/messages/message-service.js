import Chat from "../chats/chat-model.js"
import Message from "./message-model.js"


const messageService = {
    getMessages: async (contactId, meId) => {

        try {
            const messages = await Message.find({ interactedUsers: { $all: [contactId, meId] } }).lean().populate("author").exec();
            return messages || []
        } catch (error) {
            console.log('error occured in getting messages:', error)
            return []
        }

    }
}


export default messageService