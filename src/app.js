import express from "express";
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import cors from 'cors'
import config from "./lib/config.js";
import handleSocket from "./Socket.js";

const app = express();

app.use(cors())
app.use(express.json());


// do the socket connection here
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: config.FRONTEND_URL
    }
});

handleSocket(io)

app.get("/", (req, res) => {
    res.send({ status: "success" });
});

// add routes here



// Global error handling
app.use((er, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default server;

export { io }