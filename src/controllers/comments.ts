import { Router, Request } from 'express'

import BlogModel from '../models/blog'
import CommentModel from '../models/comment'

import { UserDocument } from '../models/user'

import middleware from '../utils/middleware'
import logger from '../utils/logger'

interface RequestAfterExtract extends Request {
    token: string
    user: UserDocument
}

const commentsRouter = Router()

commentsRouter.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params
        const blogWithComments = await BlogModel.findById(id).populate(
            'comments',
        )
        console.log(blogWithComments)
        return res.json(blogWithComments)
    } catch (err) {
        logger.error(err.message)
        return res.status(500).end()
    }
})

commentsRouter.post(
    '/:id/comments',
    middleware.userExtractor,
    async (req, res, next) => {
        const body = req.body

        console.log('Body debug', body)

        const user = (req as RequestAfterExtract).user

        console.log('Debug User', user)

        try {
            const { id } = req.params
            const updatedBlog = await BlogModel.findById(id)

            const comment = new CommentModel({
                content: req.body.content,
            })
            const savedComment = await comment.save()

            updatedBlog.comments = updatedBlog.comments.concat(savedComment._id)

            await updatedBlog.save()

            console.log(updatedBlog)
            console.log(savedComment)
            return res.status(201).json(savedComment.toJSON())
        } catch (err) {
            console.log(err)
            next(err)
        }
    },
)

export default commentsRouter
