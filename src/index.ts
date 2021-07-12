import http from 'http'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import BlogModel from './models/blog'

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (req, res) => {
    BlogModel.find({}).then((blogs) => {
        res.json(blogs)
    })
})

app.post('/api/blogs', (req, res) => {
    const blog = new BlogModel(req.body)

    blog.save().then((result) => {
        res.status(201).json(result)
    })
})

const PORT = 3003

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
