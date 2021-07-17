import { Request } from 'express'
import jwt from 'jsonwebtoken'

import UserModel from '../models/user'
import ClientError from './error'

interface RequestWithToken extends Request {
    token: string
}

async function getUserFromToken(request: RequestWithToken) {
    const body = request.body

    if (request.token === undefined) {
        throw new jwt.JsonWebTokenError('Token missing')
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (typeof decodedToken === 'string') {
        throw new jwt.JsonWebTokenError('Token is invalid')
    }

    const user = await UserModel.findById((decodedToken as jwt.JwtPayload).id)

    if (user === null)
        throw new ClientError(404, `User ID ${body.userId} not found`)

    return user
}

export default {
    getUserFromToken,
}
