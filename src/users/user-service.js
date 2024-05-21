import config from '../lib/envConfig.js'
import User from './user-model.js'

const userService = {

    createUser: async ({ name, email, bio, avatar, password }) => {
        const user = new User({ name, email, bio, avatar, password })
        return await user.save()
    },

    getUsers: async () => {
        const users = await User.find({}).lean()

        if (users?.length > 0) {
            const usersWithAvatarURL = users.map((user) => {
                return {
                    ...user,
                    avatar: config.BACKEND_URL + '/api/users/avatar/' + user.avatar
                }
            })

            return usersWithAvatarURL || []
        } else {
            return []
        }


    }
}


export default userService