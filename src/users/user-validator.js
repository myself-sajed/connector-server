import { body } from "express-validator";

export default [
    body("name").exists().withMessage("A valid name of the user is required"),
    body("email").exists().withMessage("The email field is missing"),
    body("password").exists().withMessage("The password field is missing"),
    body("avatar").custom((value, { req }) => {
        if (!req.file) {
            throw new Error(`Invalid image used in the form`);
        }
        return true;
    }),
];
