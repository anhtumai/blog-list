import { Router, Request } from 'express'

import BlogModel from '../models/blog'
import { UserDocument } from '../models/user'

import middleware from '../utils/middleware'
import processClientError from '../utils/error'
import logger from '../utils/logger'

interface RequestAfterExtract extends Request {
    token: string
    user: UserDocument
}

const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
    try {
        const blogs = await BlogModel.find({}).populate('user', {
            username: 1,
            name: 1,
        })
        return res.json(blogs)
    } catch (err) {
        logger.error(err.message)
        return res.status(500).end()
    }
})

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
    const body = req.body

    const user = (req as RequestAfterExtract).user

    const blog = new BlogModel({
        ...body,
        user: user._id,
    })

    try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        return res.status(201).json(savedBlog)
    } catch (err) {
        next(err)
    }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
    const { id } = req.params

    const userFromToken = (req as RequestAfterExtract).user

    try {
        const deletedBlog = await BlogModel.findById(id)

        if (deletedBlog) {
            if (deletedBlog.user.toString() === userFromToken.id.toString()) {
                await BlogModel.deleteOne({ _id: id })
                return res.status(204).end()
            } else {
                return processClientError(
                    res,
                    403,
                    'User is forbidden to delete post'
                )
            }
        } else {
            return processClientError(
                res,
                404,
                `Record with ${id} does not exist`
            )
        }

        // hmmm
    } catch (err) {
        next(err)
    }
})

blogsRouter.put('/:id', async (req, res, next) => {
    const newBlogInfo = req.body

    const { id } = req.params

    try {
        const updatedBlog = await BlogModel.findOneAndUpdate(
            { _id: id },
            newBlogInfo,
            { new: true }
        )
        if (updatedBlog) {
            return res.status(201).json(updatedBlog)
        } else {
            return processClientError(
                res,
                404,
                `Record with ${id} does not exist`
            )
        }
    } catch (err) {
        return next(err)
    }
})

export default blogsRouter
