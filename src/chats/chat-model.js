// model for chats

import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema({
    chatType: {
        type: String,
        enum: ['individual', 'group'],
        default: 'individual',
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });



export default mongoose.model('Chat', chatSchema)