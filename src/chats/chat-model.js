// model for chats

import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema({
    chatType: {
        type: String,
        enum: ['individual', 'group'],
        default: 'individual',
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: false, default: [] }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    chatable: { type: Schema.Types.Boolean, default: false, required: false }
}, { timestamps: true });



export default mongoose.model('Chat', chatSchema)