import messageService from "../messages/message-service.js";

function handleMessageOperations(io, socket, userSocketMap) {


    socket.on('message:client:edit', async (chatData) => {
        const { messageId, messageContent, selectedChat, author } = chatData;
        const chatId = selectedChat?._id
        const { message, operationalMessage, userIds, lastMessage } = await messageService.editMessage(messageId, messageContent, chatId);


        userIds.forEach(async (userId) => {
            let socketId = userSocketMap.get(userId)
            if (socketId) {
                io.to(socketId).emit("message:server:edit", { message, tempMessageId: messageId });
                const chat = {
                    _id: selectedChat._id,
                    me: userId === selectedChat?.me._id ? selectedChat?.me : selectedChat?.contact,
                    contact: userId !== selectedChat?.me._id ? selectedChat?.me : selectedChat?.contact,
                    lastMessage: lastMessage ? lastMessage : selectedChat?.lastMessage,
                    chatable: true,
                }

                io.to(socketId).emit("chat:server", { chat, shouldUpdateCount: (userId === author), isEditing: true })

                if (userId !== author) { // only update status for the recipient
                    operationalMessage.status = 'delivered';
                    await operationalMessage.save();
                    io.to(userSocketMap.get(author)).emit("message:status:update", { messageId: operationalMessage._id, status: 'delivered' });
                }


            }
        })
    });
}

export default handleMessageOperations