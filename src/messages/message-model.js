// model for chats

import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema({
    type: {
        type: String,
        enum: ['text', 'file'],
        default: 'text'
    },
    text: {
        type: String,
        require: false
    },
    filename: {
        type: String,
        require: false
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    interactedUsers: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        require: true
    },
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        require: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'seen'],
        default: 'sent'
    },
    deliveredAt: Date,
    seenAt: Date,
}, { timestamps: true });



export default mongoose.model('Message', messageSchema)