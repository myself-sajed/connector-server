import chatService from "../chats/chat-service.js";

const userSocketMap = new Map();

function handleSocket(io) {
    io.on("connection", (socket) => {
        socket.on('register', (userId) => {
            userSocketMap.set(userId, socket.id); // Map user ID to socket ID
            console.log(`User ${userId} connected with socket ID ${socket.id}`);
        });

        socket.on('message:client', async (chatData) => {
            const { userIds, messageContent, author } = chatData;
            const chat = await chatService.createOrAppendChat(userIds, messageContent, author);

            // Get the recipient's user ID
            const recipientId = userIds.find(id => id !== author);

            // Get the socket IDs of the sender and recipient
            const senderSocketId = userSocketMap.get(author);
            const recipientSocketId = userSocketMap.get(recipientId);

            // Emit the message to the sender and recipient
            if (senderSocketId) {
                io.to(senderSocketId).emit("message:server", { text: messageContent, author: { _id: author }, chat });
            }

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("message:server", { text: messageContent, author: { _id: author }, chat });
            }
        });

        socket.on("disconnect", async () => {
            // Find the user ID associated with the disconnected socket
            for (let [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
}

export default handleSocket;
