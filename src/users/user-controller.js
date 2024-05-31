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


            const isUserALreadyExists = await userService.findByEmail(email.toLowerCase().trim())

            if (!isUserALreadyExists) {
                const avatarURL = `avatar-${avatar}.jpg`
                const user = await userService.createUser({ name, email: email.toLowerCase().trim(), bio, avatar: avatarURL, password })

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
            } else {
                res.send({ status: "error", message: "The Email is already registered" })
            }

        } catch (error) {
            console.log("Error creating user:", error)
            res.send({ status: "error", message: "Could not create user" })
        }

    },

    editUser: async (req, res, next) => {

        try {
            const { name, email, bio, avatar, userId } = req.body;
            const avatarURL = `avatar-${avatar}.jpg`
            const user = await userService.editUser({ name, email: email.toLowerCase().trim(), bio, avatar: avatarURL, userId })
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
        try {
            const { loggedInUserId } = req.params
            const users = await userService.getUsers(loggedInUserId)
            res.send(users || [])
        } catch (error) {
            console.log('Error in getting users in user-controller:', error)
            res.send([])
        }
    },

    getAvatar: (req, res) => {
        try {
            const { filename } = req.params
            const avatarPath = path.join(process.cwd(), `/src/uploads/avatars/${filename}`);
            res.sendFile(avatarPath)
        } catch (error) {
            console.log('error in get avatar in user-controller', error);
            res.send(null)
        }
    }
}


export default userController