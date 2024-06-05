import config from "../lib/envConfig.js";
import User from "../users/user-model.js";
import generateAvatarURL from "../utility/generateAvatarURL.js";
import jwt from "jsonwebtoken"

const authController = {
    authenticate: async (req, res) => {

        const userToken = req.cookies.userToken;
        try {
            if (!userToken) {
                return res.send({ isAuth: false });
            } else {
                const isVerified = jwt.verify(userToken, config.JWT_SECRET)

                if (isVerified) {
                    const decodedUser = jwt.decode(userToken, config.JWT_SECRET)

                    const user = await User.findOne({ _id: decodedUser._id })

                    if (!user) {
                        return res.send({ isAuth: false });
                    }

                    return res.send({ isAuth: true, user: decodedUser });
                } else {
                    return res.send({ isAuth: false });

                }

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
                username: user.username,
                name: user.name,
                email: user.email,
                avatar: generateAvatarURL(user.avatar),
                bio: user.bio
            };

            const JWT_SECRET = config.JWT_SECRET

            const token = jwt.sign(tokenUser, JWT_SECRET, {
                expiresIn: "1d",
            });

            const isProduction = config.NODE_ENV === 'prod';
            const frontEndDomain = config.DOMAIN

            console.log(isProduction, frontEndDomain, config)

            res.cookie("userToken", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,

                secure: isProduction,
                domain: frontEndDomain,
            });

            return res.json({ status: "success", message: "User logged in successfully", token });
        } catch (error) {
            console.log(error);
            return res.json({ status: 'error', message: "Internal server error" });
        }
    },

    logout: (req, res) => {
        try {
            res.clearCookie('userToken');
            res.send({ status: 'success', message: 'User logged out successfully' });
        } catch (error) {
            res.send({ status: 'error', message: 'Something went wrong' });
        }
    }
}


export default authController