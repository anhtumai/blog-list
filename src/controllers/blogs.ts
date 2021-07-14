import { Router } from 'express'
import BlogModel from '../models/blog'

const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
    try {
        const blogs = await BlogModel.find({})
        return res.json(blogs)
    } catch (err) {
        return res.status(500).end()
    }
})

blogsRouter.post('/', async (req, res) => {
    const blog = new BlogModel(req.body)

    try {
        const result = await blog.save()
        return res.status(201).json(result)
    } catch (err) {
        console.log(err.message)
        return res.status(400).end()
    }
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

blogsRouter.put('/:id', async (req, res) => {
    const { url, author, title, likes } = req.body

    if (
        url === undefined ||
        author === undefined ||
        title === undefined ||
        likes === undefined
    ) {
        return res.status(400).json({ error: 'Info is missing' })
    }

    const { id } = req.params

    try {
        const updatedBlog = await BlogModel.findOneAndUpdate(
            { _id: id },
            { url, author, title, likes },
            { new: true }
        )
        if (updatedBlog) {
            return res.status(201).json(updatedBlog)
        } else {
            return res.status(404).end()
        }
    } catch (err) {
        console.log(err.message)
        return res.status(400).end()
    }
})

export default blogsRouter
