import Message from "../messages/message-model.js";
import generateAvatarURL from "../utility/generateAvatarURL.js";
import Chat from "./chat-model.js"

const chatService = {

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
    },

    getChats: async (meId) => {
        try {
            const chats = await Chat.find({ users: { $in: [meId] } })
                .sort({ updatedAt: -1 })
                .populate({
                    path: 'users',
                    match: { _id: { $ne: meId } },
                    select: '-password',
                })
                .populate('lastMessage')
                .exec();

            // Format the response to include me and otherUser fields
            const formattedChats = chats.map(chat => {
                const otherUser = chat.users.find((user) => user._id.toString() !== meId.toString());
                return {
                    _id: chat._id.toString(),
                    me: {
                        _id: meId.toString(),
                    },
                    contact: otherUser ? {
                        _id: otherUser._id.toString(),
                        name: otherUser.name,
                        email: otherUser.email,
                        bio: otherUser.bio,
                        avatar: generateAvatarURL(otherUser.avatar),
                        createdAt: otherUser.createdAt,
                        updatedAt: otherUser.updatedAt,
                    } : null,
                    lastMessage: chat.lastMessage,
                    createdAt: chat.createdAt.toISOString(),
                    updatedAt: chat.updatedAt.toISOString(),
                };
            });

            return formattedChats;
        } catch (error) {
            return []
        }
    }
}


export default chatService