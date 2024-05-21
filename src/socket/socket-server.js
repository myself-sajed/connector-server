import chatService from "../chats/chat-service.js"

function handleSocket(io) {
    io.on("connection", (socket) => {
        socket.on('message:client', (chatData) => {
            const { userIds, messageContent, author } = chatData
            chatService.createOrAppendChat(userIds, messageContent, author)
            socket.emit("message:server", { message: messageContent, isMe: true })
        })

        socket.on("disconnect", async () => {
            console.log("socket disconnect", socket.id)
        })

    })
}

export default handleSocket