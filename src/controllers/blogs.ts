import { Router } from 'express'
import jwt from 'jsonwebtoken'

import ClientError from '../utils/error'
import BlogModel from '../models/blog'
import UserModel, { UserDocument } from '../models/user'

import logger from '../utils/logger'
import helper from '../utils/helper'

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

    let user: UserDocument
    try {
        user = await helper.getUserFromToken(req as any)
    } catch (err) {
        return next(err)
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
        console.log(err.name)
        return next(err)
    }
})

blogsRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const deletedBlog = await BlogModel.findByIdAndRemove(id)
        if (deletedBlog) {
            return res.status(204).end()
        } else {
            throw new ClientError(404, `Record with ${id} does not exist`)
        }
    } catch (err) {
        return next(err)
    }
})

blogsRouter.put('/:id', async (req, res, next) => {
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
            throw new ClientError(404, `Record with ${id} does not exist`)
        }
    } catch (err) {
        return next(err)
    }
})

export default blogsRouter
