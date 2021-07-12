import http from 'http'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import BlogModel from './models/blog'
import blogsRouter from './controllers/blogs'

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

const PORT = 3003

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
