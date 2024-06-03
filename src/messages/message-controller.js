import messageService from "./message-service.js"

const messageController = {
    getMessages: async (req, res) => {

        const { chatId } = req.params
        const { page, limit } = req.query

        // get message logic
        const messages = await messageService.getMessages(chatId, page, limit)
        res.send(messages || [])
    }
}


export default messageController