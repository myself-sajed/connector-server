import Message from "../messages/message-model.js";
import generateAvatarURL from "../utility/generateAvatarURL.js";
import Chat from "./chat-model.js"

const chatService = {

    createChat: async (contactId, meId) => {
        try {
            // Find the chat with both users
            let foundChat = await Chat.findOne({ users: { $all: [contactId, meId], $size: 2 } })
                .populate("users", "-password")
                .populate("lastMessage")
                .exec();

            if (foundChat) {
                const chat = chatFormatter([foundChat], meId)[0];
                return { status: 'success', chat: chat };
            } else {
                // Create a new chat
                const newChat = new Chat({
                    chatType: 'individual',
                    users: [contactId, meId]
                });

                await newChat.save();

                await newChat.populate({
                    path: 'users',
                    select: '-password'
                });

                const formattedChat = chatFormatter([newChat], meId)[0];
                return { status: 'success', chat: formattedChat };
            }
        } catch (error) {
            console.log(error);
            return { status: 'error', message: "Connector could not create connection, try again later." };
        }
    },

    createOrAppendChat: async (chatId, userIds, messageContent, author, messageRepliedTo) => {
        try {

            let chat = await Chat.findOne({ _id: chatId });

            // Create a new message
            let message = new Message({
                author: author,
                chatId: chat._id,
                interactedUsers: userIds,
                type: 'text',
                seen: false,
                filename: null,
                text: messageContent,
                messageRepliedTo: messageRepliedTo ? messageRepliedTo : null
            });

            const operationalMessage = await message.save();

            message = await Message.findById(message._id).lean().populate('author').populate("messageRepliedTo").exec()


            // Append the message to the chat
            chat.messages.push(message._id);
            chat.lastMessage = message._id;
            chat.chatable = true
            await chat.save();

            return { operationalMessage, message };
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
                    select: '-password',
                })
                .populate({
                    path: 'messages',
                    match: { status: { $ne: 'seen' } }
                })
                .populate('lastMessage')
                .exec();

            // Format the response to include me and otherUser fields
            const formattedChats = chatFormatter(chats, meId)
            return formattedChats;
        } catch (error) {
            console.log('error in get chats :', error);
            return []
        }
    }
}


export default chatService


function chatFormatter(chats, meId) {
    const formattedChats = chats.map(chat => {
        const otherUser = chat.users.find((user) => user._id.toString() !== meId.toString());
        const meUser = chat.users.find((user) => user._id.toString() === meId.toString());
        return {
            _id: chat._id.toString(),
            chatable: chat.chatable,
            unreadCount: {
                [otherUser._id.toString()]: ((chat?.messages || []).filter((msg) => {
                    return msg.author.toString() !== meId.toString()
                })?.length) || 0
            },
            me: meUser ? {
                _id: meId.toString(),
                name: meUser.name,
                email: meUser.email,
                bio: meUser.bio,
                avatar: generateAvatarURL(meUser.avatar),
                createdAt: meUser.createdAt,
                updatedAt: meUser.updatedAt
            } : null,
            contact: otherUser ? {
                _id: otherUser._id.toString(),
                name: otherUser.name,
                email: otherUser.email,
                bio: otherUser.bio,
                avatar: generateAvatarURL(otherUser.avatar),
                createdAt: otherUser.createdAt,
                updatedAt: otherUser.updatedAt,
            } : null,
            lastMessage: chat.lastMessage ? {
                _id: chat.lastMessage._id.toString(),
                author: { _id: chat.lastMessage.author },
                text: chat.lastMessage.text,
                status: chat.lastMessage.status,
                updatedAt: chat.lastMessage.updatedAt
            } : null,
            createdAt: chat.createdAt.toISOString() || null,
            updatedAt: chat.updatedAt.toISOString() || null,
        };
    });

    return formattedChats
}