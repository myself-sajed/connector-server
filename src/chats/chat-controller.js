import chatService from "./chat-service.js"

const chatController = {
    createChat: async (req, res) => {
        try {
            const { contactId, meId } = req.body
            const result = await chatService.createChat(contactId, meId)
            res.send(result)
        } catch (error) {
            return { status: 'error', message: "Connector could not create connection, try again later." };
        }
    },
    getChats: async (req, res) => {
        const { meId } = req.params
        const chats = await chatService.getChats(meId)
        res.send(chats)
    }
}


export default chatController