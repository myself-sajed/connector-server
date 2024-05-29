function handleUserStatus(io, socket, userSocketMap) {
    socket.on("client:online-status", (checkStatusOf) => {
        let socketId = userSocketMap.get(checkStatusOf)
        socket.emit("server:online-status", { status: socketId ? "online" : "offline", statusOf: checkStatusOf })
    })


    socket.on("client:typing", (selectedChat) => {
        console.log('event triggered')
        const contact = selectedChat.contact._id
        let socketId = userSocketMap.get(contact)
        if (socketId) {
            io.to(socketId).emit("server:typing", { selectedChatFromServer: selectedChat, typingStatus: 'typing' })
        }
    })

    socket.on("client:stoppedTyping", (selectedChat) => {
        const contact = selectedChat.contact._id
        let socketId = userSocketMap.get(contact)
        if (socketId) {
            io.to(socketId).emit("server:typing", { selectedChatFromServer: selectedChat, typingStatus: null })
        }
    })
}




export default handleUserStatus