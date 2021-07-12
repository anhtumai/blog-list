import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import blogsRouter from './controllers/blogs'

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

export default app
