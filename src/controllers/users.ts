import { Router } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '../models/user'
import logger from '../utils/logger'

const usersRouter = Router()

usersRouter.get('/', async (req, res) => {
    try {
        const users = await UserModel.find({})
        return res.json(users)
    } catch (err) {
        return res.status(500).end()
    }
})

usersRouter.post('/', async (req, res) => {
    const body = req.body

    if (body.password === undefined) {
        return res.status(400).json({ error: 'Password is missing' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new UserModel({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    try {
        const result = await user.save()
        return res.status(201).json(result)
    } catch (err) {
        logger.error(err.message)
        return res.status(400).end()
    }
})

export default usersRouter
