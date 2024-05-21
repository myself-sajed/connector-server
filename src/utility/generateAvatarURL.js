import config from "../lib/envConfig.js";

function generateAvatarURL(avatar) {
    return config.BACKEND_URL + '/api/users/avatar/' + avatar
}

export default generateAvatarURL