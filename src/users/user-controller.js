import { validationResult } from "express-validator";
import userService from "./user-service.js";
import path from "path"
import generateAvatarURL from "../utility/generateAvatarURL.js";
import jwt from "jsonwebtoken"
import config from "../lib/envConfig.js";

const userController = {

    createUser: async (req, res, next) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        try {
            const { name, email, bio, password, avatar } = req.body;
            const avatarURL = `avatar-${avatar}.jpg`
            const user = await userService.createUser({ name, email, bio, avatar: avatarURL, password })
            const tokenUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: generateAvatarURL(user.avatar),
                bio: user.bio
            };

            const JWT_SECRET = config.JWT_SECRET


            const token = jwt.sign(tokenUser, JWT_SECRET, {
                expiresIn: "1d",
            });

            res.cookie("userToken", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                domain: "localhost",
            });
            res.send({ status: "success", user: tokenUser })
        } catch (error) {
            console.log("Error creating user:", error)
            res.send({ status: "error", message: "Could not create user" })
        }

    },

    editUser: async (req, res, next) => {

        try {
            const { name, email, bio, avatar, userId } = req.body;
            const avatarURL = `avatar-${avatar}.jpg`
            const user = await userService.editUser({ name, email, bio, avatar: avatarURL, userId })
            const tokenUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: generateAvatarURL(user.avatar),
                bio: user.bio
            };

            const JWT_SECRET = config.JWT_SECRET


            const token = jwt.sign(tokenUser, JWT_SECRET, {
                expiresIn: "1d",
            });

            res.cookie("userToken", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                domain: "localhost",
            });
            res.send({ status: "success", user: tokenUser })
        } catch (error) {
            console.log("Error creating user:", error)
            res.send({ status: "error", message: "Could not create user" })
        }

    },

    getUsers: async (req, res) => {
        const { loggedInUserId } = req.params
        const users = await userService.getUsers(loggedInUserId)
        res.send(users || [])
    },

    getAvatar: (req, res) => {
        const { filename } = req.params
        const avatarPath = path.join(process.cwd(), `/src/uploads/avatars/${filename}`);
        res.sendFile(avatarPath)
    }
}


export default userController