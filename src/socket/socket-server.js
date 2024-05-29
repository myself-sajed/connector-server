import handleOnClientMessage from "./client-message-socket.js";
import handleUserStatus from "./handle-user-status.js";
import handleMessageOperations from "./handleMessageOperations.js";
import { handleSocketDisconnection, registerSocketUser } from "./register-disconnection-socket.js";

const userSocketMap = new Map();

function handleSocket(io) {
    io.on("connection", (socket) => {
        registerSocketUser(io, socket, userSocketMap);
        handleUserStatus(io, socket, userSocketMap);
        handleOnClientMessage(io, socket, userSocketMap);
        handleMessageOperations(io, socket, userSocketMap);
        handleSocketDisconnection(socket, userSocketMap);
    });
}

export default handleSocket;
