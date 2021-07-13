import { Router } from 'express'
import BlogModel from '../models/blog'

const blogsRouter = Router()

blogsRouter.get('/', (req, res) => {
    BlogModel.find({}).then((blogs) => {
        res.json(blogs)
    })
})

blogsRouter.post('/', (req, res) => {
    const blog = new BlogModel(req.body)

    blog.save()
        .then((result) => {
            res.status(201).json(result)
        })
        .catch((err) => {
            console.log(err.message)
            res.status(400).end()
        })
})

export default blogsRouter
