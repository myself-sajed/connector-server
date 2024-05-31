import dotenv from 'dotenv'
dotenv.config()

import app from "../src/app.js";
import config from './lib/envConfig.js';
import connectToDB from './lib/dbConfig.js';

const startServer = async () => {
    try {
        await connectToDB()
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


try {
    startServer();
} catch (error) {
    console.log('Error starting the server :', error);
}