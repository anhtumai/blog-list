import { Router } from 'express'
import jwt from 'jsonwebtoken'

import BlogModel from '../models/blog'
import UserModel, { UserDocument } from '../models/user'

import logger from '../utils/logger'

const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
    try {
        const blogs = await BlogModel.find({}).populate('user', {
            username: 1,
            name: 1,
        })
        return res.json(blogs)
    } catch (err) {
        return res.status(500).end()
    }
})

blogsRouter.post('/', async (req, res, next) => {
    const body = req.body

    let decodedToken: string | jwt.JwtPayload
    try {
        if ((req as any).token === undefined) {
            throw new jwt.JsonWebTokenError('Token missing')
        }
        decodedToken = jwt.verify((req as any).token, process.env.SECRET)
        if (typeof decodedToken === 'string') {
            throw new jwt.JsonWebTokenError('Token is invalid')
        }
    } catch (err) {
        return next(err)
    }

    let user: UserDocument
    try {
        user = await UserModel.findById((decodedToken as jwt.JwtPayload).id)
        if (user === null) {
            logger.error(`User ID ${body.userId} not found`)
            return res.status(404).end()
        }
    } catch (err) {
        logger.error(err.message)
        return res.status(400).end()
    }
    const blog = new BlogModel({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
    })

    try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        return res.status(201).json(savedBlog)
    } catch (err) {
        logger.error(err.message)
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
            const errorMessage = `Record with ${id} does not exist`
            return res.status(404).json({ error: errorMessage })
        }
    } catch (err) {
        logger.error(err.message)
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
        const errorMessage = 'Info is missing'
        logger.error(errorMessage)
        return res.status(400).json({ error: errorMessage })
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
            logger.error(`Record with ${id} does not exist`)
            return res.status(404).end()
        }
    } catch (err) {
        logger.error(err.message)
        return res.status(400).end()
    }
})

export default blogsRouter
