import chatService from "../chats/chat-service.js";
import messageModel from "../messages/message-model.js";


function handleOnClientMessage(io, socket, userSocketMap) {

    socket.on('message:client', async (chatData) => {
        const { selectedChat, messageContent, author, tempMessageId, messageRepliedTo } = chatData;
        const userIds = [selectedChat?.me._id, selectedChat?.contact._id];
        const chatId = selectedChat?._id

        userIds.forEach((userId) => {
            const socketId = userSocketMap.get(userId)
            if (userId === author) {
                const chat = {
                    _id: selectedChat._id,
                    me: userId === selectedChat?.me._id ? selectedChat?.me : selectedChat?.contact,
                    contact: userId !== selectedChat?.me._id ? selectedChat?.me : selectedChat?.contact,
                    lastMessage: { author: { _id: author }, status: "optimistic", text: messageContent },
                    chatable: true,
                }

                io.to(socketId).emit("chat:server", { chat, shouldUpdateCount: (userId === author) })
            }
        })



        const { message, operationalMessage } = await chatService.createOrAppendChat(chatId, userIds, messageContent, author, messageRepliedTo);

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
                    io.to(socketId).emit("chat:notification", chat)
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