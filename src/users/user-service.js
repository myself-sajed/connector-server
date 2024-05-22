import generateAvatarURL from '../utility/generateAvatarURL.js'
import User from './user-model.js'

const userService = {

    createUser: async ({ name, email, bio, avatar, password }) => {
        const user = new User({ name, email, bio, avatar, password })
        return await user.save()
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


    }
}


export default userService