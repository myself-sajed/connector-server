import handleOnClientMessage from "./client-message-socket.js";
import handleCodeChange from "./handle-code-change.js";
import handleUserStatus from "./handle-user-status.js";
import handleMessageOperations from "./handleMessageOperations.js";
import { handleSocketDisconnection, registerSocketUser } from "./register-disconnection-socket.js";

const userSocketMap = new Map();
const userCodeMap = new Map();

function handleSocket(io) {
    io.on("connection", (socket) => {
        registerSocketUser(io, socket, userSocketMap);
        handleUserStatus(io, socket, userSocketMap);
        handleOnClientMessage(io, socket, userSocketMap);
        handleMessageOperations(io, socket, userSocketMap);
        handleCodeChange(io, socket, userSocketMap, userCodeMap);
        handleSocketDisconnection(socket, userSocketMap);
    });
}

export default handleSocket;
