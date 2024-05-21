import dotenv from 'dotenv'
dotenv.config()

import app from "../src/app.js";
import config from './lib/config.js';

const startServer = () => {
    try {
        const PORT = config.PORT;
        app.listen(PORT, () => console.log(`Server running at ${PORT}`));
    } catch (error) {
        if (error) {
            console.log("Could not start server");
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

startServer();