import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Router } from 'express'

import UserModel from '../models/user'

const loginRouter = Router()

loginRouter.post('/', async (req, res) => {
    const body = req.body

    const user = await UserModel.findOne({ username: body.username })
    const passwordCorrect =
        user == null
            ? false
            : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password',
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: '3600s',
    })

    res.status(200).send({ token, username: user.username, name: user.name })
})

export default loginRouter
