
// libraries
import express from "express";
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import cors from 'cors'
import config from "./lib/envConfig.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// routes 
import userRouter from './users/user-routes.js'
import chatRouter from './chats/chat-routes.js'
import messageRouter from './messages/message-routes.js'
import authRouter from './auth/auth-routes.js'

//other imports
import handleSocket from "./socket/socket-server.js";


// express config
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());


// socket config
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: config.FRONTEND_URL,
    }
});
handleSocket(io)

app.get('/', function (req, res) {
    res.send({ message: "Welcome to Connector Server! Have a good day." })
})

// add routes here
app.use('/api/users', userRouter)
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)
app.use('/api/auth', authRouter)


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