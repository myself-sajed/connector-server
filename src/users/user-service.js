import User from './user-model.js'

const userService = {

    createUser: async ({ name, email, bio, avatar, password }) => {
        const user = new User({ name, email, bio, avatar, password })
        return await user.save()
    }
}


export default userService