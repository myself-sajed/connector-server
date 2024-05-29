import config from "../lib/envConfig.js";
import User from "../users/user-model.js";
import generateAvatarURL from "../utility/generateAvatarURL.js";
import jwt from "jsonwebtoken"

const authController = {
    authenticate: (req, res) => {

        const userToken = req.cookies.userToken;
        try {
            if (!userToken) {
                return res.send({ isAuth: false });
            } else {
                const isVerified = jwt.verify(userToken, config.JWT_SECRET)
                const decodedUser = jwt.decode(userToken, config.JWT_SECRET)
                if (!isVerified) {
                    return res.send({ isAuth: false });
                }

                return res.send({ isAuth: true, user: decodedUser });
            }
        } catch (error) {
            console.log(error)
            return res.send({ isAuth: false });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.json({ status: 'error', message: "Please enter all fields" });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.json({ status: "error", message: "Incorrect email or password" });
            }

            const isMatch = user.password === password;

            if (!isMatch) {
                return res.json({ status: "error", message: "Incorrect email or password" });
            }

            const tokenUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: generateAvatarURL(user.avatar),
                bio: user.bio
            };

            const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            res.cookie("userToken", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                domain: "localhost",
            });

            return res.json({ status: "success", message: "User logged in successfully", token });
        } catch (error) {
            console.log(error);
            return res.json({ status: 'error', message: "Internal server error" });
        }
    },

    logout: (req, res) => {
        console.log('logout')
        try {
            res.clearCookie('userToken');
            res.send({ status: 'success', message: 'User logged out successfully' });
        } catch (error) {
            res.send({ status: 'error', message: 'Something went wrong' });
        }
    }
}


export default authController