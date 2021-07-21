import { Router } from 'express'

import UserModel from '../models/user'
import BlogModel from '../models/blog'

import logger from '../utils/logger'

const testingRouter = Router()

testingRouter.post('/reset', async (req, res) => {
    try {
        await UserModel.deleteMany({})
        await BlogModel.deleteMany({})
        res.status(204).end()
    } catch (err) {
        logger.error(err)
        res.status(500).end()
    }
})

export default testingRouter
