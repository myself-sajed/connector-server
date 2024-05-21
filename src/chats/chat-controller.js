import chatService from "./chat-service.js"

const chatController = {
    getChats: async (req, res) => {
        const { meId } = req.params
        const chats = await chatService.getChats(meId)
        res.send(chats)
    }
}


export default chatController