import config from "../lib/envConfig.js";

function cookieSetter(res, token) {
    const isProduction = config.NODE_ENV === 'prod';
    const frontEndDomain = config.DOMAIN.startsWith('.') ? config.DOMAIN : `.${config.DOMAIN}`;

    console.log(isProduction, frontEndDomain, config);

    res.cookie("userToken", token, {
        maxAge: ((60 * 60 * 1000) * 24) * 7, // 7 days
        httpOnly: true,
        secure: isProduction,
        sameSite: 'None',
        domain: frontEndDomain,
        path: '/'
    });
}


export default cookieSetter