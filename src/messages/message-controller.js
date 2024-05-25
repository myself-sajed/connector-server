import messageService from "./message-service.js"

const messageController = {
    getMessages: async (req, res) => {

        const { chatId } = req.params

        // get message logic
        const messages = await messageService.getMessages(chatId)
        res.send(messages || [])
    }
}


export default messageController