import messageService from "./message-service.js"

const messageController = {
    getMessages: async (req, res) => {

        const { contactId, meId } = req.params

        // get message logic
        const messages = await messageService.getMessages(contactId, meId)
        res.send(messages || [])
    }
}


export default messageController