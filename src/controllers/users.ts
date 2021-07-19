import { Router } from 'express'
import bcrypt from 'bcrypt'

import UserModel from '../models/user'
import processClientError from '../utils/error'

const usersRouter = Router()

usersRouter.get('/', async (req, res) => {
    try {
        const users = await UserModel.find({}).populate('blogs', {
            title: 1,
            author: 1,
            url: 1,
            likes: 1,
        })
        return res.json(users)
    } catch (err) {
        return res.status(500).end()
    }
})

usersRouter.post('/', async (req, res, next) => {
    const body = req.body

    if (!body.password) {
        return processClientError(res, 400, 'Password is missing')
    }

    if (body.password.length < 3) {
        return processClientError(res, 400, 'Password is too short')
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
        next(err)
    }
})

export default usersRouter
