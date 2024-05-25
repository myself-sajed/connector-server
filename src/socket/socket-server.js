import handleOnClientMessage from "./client-message-socket.js";
import { handleSocketDisconnection, registerSocketUser } from "./register-disconnection-socket.js";

const userSocketMap = new Map();

function handleSocket(io) {
    io.on("connection", (socket) => {
        registerSocketUser(io, socket, userSocketMap);
        handleOnClientMessage(io, socket, userSocketMap);
        handleSocketDisconnection(socket, userSocketMap);
    });
}

export default handleSocket;
