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

describe('Test POST request on /api/users', () => {
    test('if length of users increase by 1 when making a post request', async () => {
        const newUser = {
            username: 'anhtumai',
            name: 'Anh Tu Mai',
            password: 'anhtumaipassword',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const currentUsers = await UserModel.find({})
        expect(currentUsers).toHaveLength(initialUsers.length + 1)
    })

    test('if name, username or password property is missing when making a post request, it will return 404 code', async () => {
        const user1 = {
            name: 'Anh Tu Mai',
            password: 'anhtumaipassword',
        }

        const user2 = {
            username: 'anhtumai',
            password: 'anhtumaipassword',
        }

        const user3 = {
            name: 'Anh Tu Mai',
            username: 'anhtumai',
        }

        const validUser = {
            name: 'Anh Tu Mai',
            username: 'anhtumai',
            password: 'anhtumaipassword',
        }

        await api.post('/api/users').send(user1).expect(400)
        await api.post('/api/users').send(user2).expect(400)
        await api.post('/api/users').send(user3).expect(400)
    })

    test('if name, username or password property is missing when making a post request, it will return 404 code', async () => {
        const user1 = {
            name: 'Anh Tu Mai',
            password: 'anhtumaipassword',
        }

        const user2 = {
            username: 'anhtumai',
            password: 'anhtumaipassword',
        }

        const user3 = {
            name: 'Anh Tu Mai',
            username: 'anhtumai',
        }

        const validUser = {
            name: 'Anh Tu Mai',
            username: 'anhtumai',
            password: 'anhtumaipassword',
        }

        await api.post('/api/users').send(user1).expect(400)
        await api.post('/api/users').send(user2).expect(400)
        await api.post('/api/users').send(user3).expect(400)
    })

    test('if password is too short, status code is 400', async () => {
        const user = {
            username: 'anhtumai2',
            name: 'Tu Mai',
            password: 'xx',
        }

        await api.post('/api/users').send(user).expect(400)
    })
    test('if username is dupplicated, status code is 400', async () => {
        const user = {
            username: 'anhtumai',
            name: 'Tu Mai',
            password: 'xxxxxxxxxxxx',
        }

        await api.post('/api/users').send(user).expect(201)
        await api.post('/api/users').send(user).expect(400)
    })
    test('if username has less than 3 characters, status code is 400', async () => {
        const user = {
            username: 'xx',
            name: 'Anh Tu Mai',
            password: 'xxpassword',
        }
        await api.post('/api/users').send(user).expect(400)
    })
})
afterAll(() => {
    mongoose.connection.close()
})
