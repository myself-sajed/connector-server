// create a function for connecting to mongodb

import mongoose from 'mongoose'
import config from './envConfig.js'

const connectToDB = async () => {

    try {

        await mongoose.connect(config.DATABASE_URL)

        console.log('MongoDB connected successfully')

    } catch (error) {
        console.log('Database connection failed')
    }

}


export default connectToDB