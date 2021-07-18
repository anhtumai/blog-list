import logger from './logger'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import UserModel from '../models/user'

import ClientError from './error'

function requestLogger(
    request: Request,
    response: Response,
    next: NextFunction
) {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

function unknownEndpoint(request: Request, response: Response) {
    response.status(404).json({ error: 'unknown endpoint' })
}

function errorHandler(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' })
    } else if (error.name === 'ClientError') {
        return response
            .status((error as ClientError).statusCode)
            .json({ error: error.message })
    }
    next(error)
}

function tokenExtractor(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        (request as any).token = authorization.substring(7)
    }
    next()
}

async function userExtractor(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        if ((request as any).token === undefined) {
            throw new jwt.JsonWebTokenError('Token missing')
        }

        const decodedToken = jwt.verify(
            (request as any).token,
            process.env.SECRET
        )

        if (typeof decodedToken === 'string') {
            throw new jwt.JsonWebTokenError('Token is invalid')
        }

        const userId = (decodedToken as jwt.JwtPayload).id

        ;(request as any).user = await UserModel.findById(userId)
    } catch (err) {
        return next(err)
    }

    next()
}

export default {
    requestLogger,
    userExtractor,
    tokenExtractor,
    unknownEndpoint,
    errorHandler,
}
