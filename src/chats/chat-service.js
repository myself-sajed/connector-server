import Message from "../messages/message-model.js";
import Chat from "./chat-model.js"

const chatService = {

    // data we would need
    // const chatData = {
    //     userIds : [1, 2],
    //     messageContent : 'hello',
    //     author : 1
    // },

    createOrAppendChat: async (userIds, messageContent, author) => {
        try {
            // Check if an individual chat already exists with these users
            let chat = await Chat.findOne({ chatType: 'individual', users: { $all: userIds, $size: userIds.length } });

            // If chat does not exist, create a new one
            if (!chat) {
                chat = new Chat({
                    chatType: 'individual',
                    users: userIds,
                });
                await chat.save();
            }

            // Create a new message
            const message = new Message({
                author: author,
                chatId: chat._id,
                type: 'text',
                seen: false,
                filename: null,
                text: messageContent,
            });

            await message.save();

            // Append the message to the chat
            chat.messages.push(message._id);
            chat.lastMessage = message._id;
            await chat.save();

            return chat;
        } catch (error) {
            console.error('Error creating or appending chat:', error);
            throw error;
        }
    }
}


export default chatService