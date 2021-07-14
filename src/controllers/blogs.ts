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

blogsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const deletedBlog = await BlogModel.findByIdAndRemove(id)
        if (deletedBlog) {
            return res.status(204).end()
        } else {
            return res
                .status(404)
                .json({ error: `Record with ${id} does not exist` })
        }
    } catch (err) {
        console.log(err.message)
        return res.status(400).end()
    }
})

export default blogsRouter
