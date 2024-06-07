import config from "../lib/envConfig.js";

function cookieSetter(res, token) {
    const isProduction = config.NODE_ENV === 'prod';
    const frontEndDomain = config.DOMAIN

    res.cookie("userToken", token, {
        maxAge: ((60 * 60 * 1000) * 24) * 7, // 7 days
        httpOnly: true,
        secure: isProduction,
        sameSite: 'None',
        path: '/'
    });
}


export default cookieSetter