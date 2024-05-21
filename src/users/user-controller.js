import { validationResult } from "express-validator";
import userService from "./user-service.js";
import path from "path"

const userController = {

    createUser: async (req, res, next) => {

        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        try {
            const avatar = req.file.filename
            const { name, email, bio, password } = req.body;
            const user = await userService.createUser({ name, email, bio, avatar, password })
            res.send(user)
        } catch (error) {
            console.log('Error creating user', error)
        }
    },

    getUsers: async (req, res) => {
        const users = await userService.getUsers()
        res.send(users || [])
    },

    getAvatar: (req, res) => {
        const { filename } = req.params
        const avatarPath = path.join(process.cwd(), `/src/uploads/avatars/${filename}`);
        res.sendFile(avatarPath)
    }
}


export default userController