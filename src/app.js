
// libraries
import express from "express";
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import cors from 'cors'
import config from "./lib/envConfig.js";
import bodyParser from "body-parser";

// routes 
import userRouter from './users/user-routes.js'
import handleSocket from "./socket/socket-server.js";


// express config
const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());


// socket config
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: config.FRONTEND_URL
    }
});
handleSocket(io)


// add routes here
app.use('/api/users', userRouter)


// Global error handling
app.use((err, req, res, next) => {
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