import chatService from "../chats/chat-service.js";

const userSocketMap = new Map();

function handleSocket(io) {
    io.on("connection", (socket) => {
        socket.on('register', (userId) => {
            userSocketMap.set(userId, socket.id); // Map user ID to socket ID
            // console.log('Socket user map:', userSocketMap);
        });

        socket.on('message:client', async (chatData) => {
            const { userIds, messageContent, author, selectedContactId } = chatData;
            const { user1, user2, message, } = await chatService.createOrAppendChat(userIds, messageContent, author, selectedContactId);

            userIds.forEach((userId) => {
                let socketId = userSocketMap.get(userId)
                if (socketId) {
                    io.to(socketId).emit("message:server", { message });
                    io.to(socketId).emit("chat:server", userId !== user1.contact._id ? user1 : user2)
                }
            })
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
