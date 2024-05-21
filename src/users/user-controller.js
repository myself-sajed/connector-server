import { validationResult } from "express-validator";
import userService from "./user-service.js";

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
            console.log('error occured')
        }
    }
}


export default userController