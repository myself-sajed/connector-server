function handleCodeChange(io, socket, userSocketMap, userCodeMap) {

    socket.on("client:code-change", ({ chat, code, language }) => {

        const serverCode = userCodeMap.get(chat.chatId)

        if (!serverCode) {
            userCodeMap.set(chat.chatId, { [language]: code })
        } else {
            userCodeMap.set(chat.chatId, { ...serverCode, [language]: code })
        }

        const socketId = userSocketMap.get(chat.contactId)
        io.to(socketId).emit("server:code-change", { chat, code, language })
    })


    socket.on("client:code-retrieval", (chat) => {
        let serverCode = userCodeMap.get(chat.chatId)

        if (!serverCode) {
            serverCode = { html: "", css: "", javascript: "", json: "", }
        }

        socket.emit("server:code-retrieval", { chat, serverCode })
    })


}

export default handleCodeChange