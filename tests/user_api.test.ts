import mongoose from 'mongoose'
import supertest from 'supertest'
import bcrypt from 'bcrypt'

import app from '../src/app'
import UserModel from '../src/models/user'

const api = supertest(app)

const initialUsers = [
    {
        username: 'hellas',
        name: 'Arto Hellas',
        password: 'hellaspassword',
    },
    {
        username: 'mluukkai',
        name: 'matti Luukainen',
        password: 'mluukkaipassword',
    },
]

const saltRounds = 10

beforeEach(async () => {
    await UserModel.deleteMany({})
    for (const user of initialUsers) {
        const userInDb = {
            username: user.username,
            name: user.name,
            passwordHash: await bcrypt.hash(user.password, saltRounds),
        }
        const userObject = new UserModel(userInDb)
        await userObject.save()
    }
})

describe('Test get request on /api/users', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('all users are returned', async () => {
        const response = await api.get('/api/users')

        expect(response.body).toHaveLength(initialUsers.length)
    })

    test('a specific user is within the returned users', async () => {
        const response = await api.get('/api/users')

        const usernames = response.body.map((user) => user.username)
        expect(usernames).toContain('hellas')
        expect(usernames).toContain('mluukkai')
    })

    test('identifier property of user is named id and password hash is missing', async () => {
        const response = await api.get('/api/users')

        const firstUser = response.body[0]

        expect(firstUser._id).toBeUndefined()
        expect(firstUser.__v).toBeUndefined()
        expect(firstUser.passwordHash).toBeUndefined()
        expect(firstUser.id).toBeDefined()
        expect(typeof firstUser.id).toBe('string')
    })
})

afterAll(() => {
    mongoose.connection.close()
})
