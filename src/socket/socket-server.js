import chatService from "../chats/chat-service.js";

const userSocketMap = new Map();

function handleSocket(io) {
    io.on("connection", (socket) => {
        socket.on('register', (userId) => {
            userSocketMap.set(userId, socket.id); // Map user ID to socket ID
        });

        socket.on('message:client', async (chatData) => {
            const { selectedChat, messageContent, author } = chatData;
            const userIds = [selectedChat?.me._id, selectedChat?.contact._id];
            const chatId = selectedChat?._id
            const { message } = await chatService.createOrAppendChat(chatId, userIds, messageContent, author);

            userIds.forEach((userId) => {
                let socketId = userSocketMap.get(userId)
                if (socketId) {
                    io.to(socketId).emit("message:server", { message });

                    const chat = {
                        _id: selectedChat._id,
                        me: userId === selectedChat?.me._id ? selectedChat?.me : selectedChat?.contact,
                        contact: userId !== selectedChat?.me._id ? selectedChat?.me : selectedChat?.contact,
                        lastMessage: message,
                        chatable: true
                    }

                    io.to(socketId).emit("chat:server", chat)
                }
            })
        });

        socket.on("disconnect", async () => {
            // Find the user ID associated with the disconnected socket
            for (let [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        });
    });
}

export default handleSocket;
