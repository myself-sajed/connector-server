import Message from "../messages/message-model.js";

export function registerSocketUser(io, socket, userSocketMap) {
    socket.on('register', async (userId) => {
        userSocketMap.set(userId, socket.id); // Map user ID to socket ID

        // send the online status to every user
        socket.broadcast.emit("server:online-status", { status: "online", statusOf: userId })

        // Find and update undelivered messages
        const undeliveredMessages = await Message.find({ interactedUsers: { $in: [userId] }, status: 'sent', author: { $ne: userId } });

        for (let message of undeliveredMessages) {
            message.status = 'delivered';
            message.deliveredAt = new Date();
            await message.save();

            const senderSocketId = userSocketMap.get(message.author.toString());
            if (senderSocketId) {
                io.to(senderSocketId).emit("message:status:update", { messageId: message._id, status: 'delivered' });
            }
        }
    });

}

export function handleSocketDisconnection(socket, userSocketMap) {
    socket.on("disconnect", async () => {
        // Find the user ID associated with the disconnected socket
        for (let [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                socket.broadcast.emit("server:online-status", { status: "offline", statusOf: userId })
                break;
            }
        }
    });
}