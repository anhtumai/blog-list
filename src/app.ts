import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import blogsRouter from './controllers/blogs'
import config from './utils/config'

const app = express()

const url = config.MONGODB_URI

mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then((result) => {
        console.log('Connect to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

export default app
