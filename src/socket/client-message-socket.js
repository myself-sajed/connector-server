import chatService from "../chats/chat-service.js";
import messageModel from "../messages/message-model.js";
import chatModel from "../chats/chat-model.js";


function handleOnClientMessage(io, socket, userSocketMap) {

    socket.on('message:client', async (chatData) => {
        const { selectedChat, messageContent, author, tempMessageId } = chatData;
        const userIds = [selectedChat?.me._id, selectedChat?.contact._id];
        const chatId = selectedChat?._id
        const { message, operationalMessage } = await chatService.createOrAppendChat(chatId, userIds, messageContent, author);

        userIds.forEach(async (userId) => {
            let socketId = userSocketMap.get(userId)
            if (socketId) {
                io.to(socketId).emit("message:server", { message, tempMessageId });
                const chat = {
                    _id: selectedChat._id,
                    me: userId === selectedChat?.me._id ? selectedChat?.me : selectedChat?.contact,
                    contact: userId !== selectedChat?.me._id ? selectedChat?.me : selectedChat?.contact,
                    lastMessage: message,
                    chatable: true,
                }

                io.to(socketId).emit("chat:server", { chat, shouldUpdateCount: (userId === author) })

                if (userId !== author) { // only update status for the recipient
                    operationalMessage.status = 'delivered';
                    await operationalMessage.save();
                    io.to(userSocketMap.get(author)).emit("message:status:update", { messageId: operationalMessage._id, status: 'delivered' });
                }


            }
        })
    });

    socket.on("client:status:delivered", async ({ chatId, userId, contactId }) => {
        const messages = await messageModel.find({ chatId, author: { $ne: userId }, status: { $ne: 'seen' } })

        messages.forEach(async (message) => {
            message.status = "seen"
            await message.save();
            io.to(userSocketMap.get(message.author.toString())).emit("server:status:delivered", message)
        })

        if (messages.length > 0) {
            io.to(userSocketMap.get(userId)).emit("chat:unreadCount", { chatId })
        }

    })
}



export default handleOnClientMessage