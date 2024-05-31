import generateAvatarURL from '../utility/generateAvatarURL.js'
import User from './user-model.js'

const userService = {

    findByEmail: async (email) => {
        return await User.findOne({ email: email })
    },

    createUser: async ({ username, name, email, bio, avatar, password }) => {
        const user = new User({ username, name, email, bio: bio || "Let's Connect on Connector", avatar, password })
        return await user.save()
    },

    editUser: async ({ username, name, email, bio, avatar, userId }) => {
        const user = await User.findOneAndUpdate({ _id: userId }, { username, name, email, bio: bio || "Let's Connect on Connector", avatar }, { new: true })
        return user
    },

    getUsers: async (loggedInUserId) => {
        const users = await User.find({ _id: { $ne: loggedInUserId } }).lean()

        if (users?.length > 0) {
            const usersWithAvatarURL = users.map((user) => {
                return {
                    ...user,
                    avatar: generateAvatarURL(user.avatar)
                }
            })

            return usersWithAvatarURL || []
        } else {
            return []
        }


    },

    checkUsername: async (username) => {
        return await User.findOne({ username }).lean();
    }
}


export default userService