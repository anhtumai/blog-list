import mongoose from 'mongoose'
import supertest from 'supertest'

import app from '../src/app'
import BlogModel from '../src/models/blog'
import UserModel from '../src/models/user'
import initialBlogs from './blogs'
import initialUsers from './users'

const api = supertest(app)

let hellasToken = ''
let mluukkaiToken = ''

const invalidToken = 'invalidToken'

beforeAll(async () => {
    await UserModel.deleteMany({})
    for (const user of initialUsers) {
        await api.post('/api/users').send(user)
    }

    const hellasLoginUser = {
        username: 'hellas',
        password: 'hellaspassword',
    }

    const mluukkaiLoginUser = {
        username: 'mluukkai',
        password: 'mluukkaipassword',
    }

    const hellasLoginResponse = await api
        .post('/api/login')
        .send(hellasLoginUser)
    hellasToken = hellasLoginResponse.body.token
    const mluukaiLoginResponse = await api
        .post('/api/login')
        .send(mluukkaiLoginUser)
    mluukkaiToken = mluukaiLoginResponse.body.token
})

beforeEach(async () => {
    await BlogModel.deleteMany({})
    for (const blog of initialBlogs) {
        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + hellasToken)
            .send(blog)
    }
})

describe('Test get request on /api/blogs', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map((blog) => blog.title)
        expect(contents).toContain('Type wars')
    })

    test('identifier property of blog post is named id', async () => {
        const response = await api.get('/api/blogs')

        const firstBlog = response.body[0]

        expect(firstBlog._id).toBeUndefined()
        expect(firstBlog.__v).toBeUndefined()
        expect(firstBlog.id).toBeDefined()
        expect(typeof firstBlog.id).toBe('string')
    })
})

describe('Test POST request on /api/blogs', () => {
    test('if length of blogs increase by 1 when making a post request', async () => {
        const newBlog = {
            title: 'FP vs. OO',
            author: 'Robert C. Martin',
            url: 'https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html',
            likes: 8,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + hellasToken)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const currentBlogs = await BlogModel.find({})
        expect(currentBlogs).toHaveLength(initialBlogs.length + 1)
    })

    test('if length of blogs does not increase when making a post request with invalid token or missing token', async () => {
        const newBlog = {
            title: 'FP vs. OO',
            author: 'Robert C. Martin',
            url: 'https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html',
            likes: 8,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + invalidToken)
            .send(newBlog)
            .expect(401)
        await api.post('/api/blogs').send(newBlog).expect(401)

        const currentBlogs = await BlogModel.find({})
        expect(currentBlogs).toHaveLength(initialBlogs.length)
    })
    test('if likes property is missing when making a post request, it will default to 0', async () => {
        const newBlog = {
            title: 'FP vs. OO',
            author: 'Robert C. Martin',
            url: 'https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html',
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + hellasToken)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body.likes).toEqual(0)
        const newBlogsInDB = await BlogModel.find({ title: newBlog.title })
        expect((newBlogsInDB[0] as any).likes).toEqual(0)
    })

    test('if url or title property is missing when making post request, response with 400', async () => {
        const missingBlog1 = {
            title: 'FP vs. OO',
            author: 'Robert C. Martin',
        }
        const missingBlog2 = {
            author: 'Robert C. Martin',
            url: 'https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + hellasToken)
            .send(missingBlog1)
            .expect(400)
        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer ' + hellasToken)
            .send(missingBlog2)
            .expect(400)
    })
})

describe('Test DELETE request', () => {
    test('DELETE request with invalid/forbidden token', async () => {
        const bookName = 'React patterns'

        const deletedBlogs = await BlogModel.find({ title: bookName })
        const deletedId = deletedBlogs[0]._id

        // delete without token will return 401
        await api.delete(`/api/blogs/${deletedId}`).expect(401)

        // delete with mluukkai token will return 403
        await api
            .delete(`/api/blogs/${deletedId}`)
            .set('Authorization', 'Bearer ' + invalidToken)
            .expect(401)

        // delete with mluukkai token will return 403
        await api
            .delete(`/api/blogs/${deletedId}`)
            .set('Authorization', 'Bearer ' + mluukkaiToken)
            .expect(403)

        // check if book with that name still present
        const checkedBlogs = await BlogModel.find({ title: bookName })
        expect(checkedBlogs).toHaveLength(1)
    })
    test('DELETE request with valid token', async () => {
        const bookName = 'React patterns'

        const deletedBlogs = await BlogModel.find({ title: bookName })
        const deletedId = deletedBlogs[0]._id

        // delete with mluukkai token will return 403
        await api
            .delete(`/api/blogs/${deletedId}`)
            .set('Authorization', 'Bearer ' + hellasToken)
            .expect(204)

        // check if no book with that name is present
        const checkedBlogs = await BlogModel.find({ title: bookName })
        expect(checkedBlogs).toHaveLength(0)

        await api
            .delete(`/api/blogs/${deletedId}`)
            .set('Authorization', 'Bearer ' + hellasToken)
            .expect(404)

        await api
            .delete('/api/blogs/invalid-id')
            .set('Authorization', 'Bearer ' + hellasToken)
            .expect(400)
    })
})

describe('Test PUT request', () => {
    test('PUT request', async () => {
        const selectedBlog = {
            likes: 5,
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        }

        const newLikes = 100

        const selectedBlogsInDb = await BlogModel.find(selectedBlog)
        const id = selectedBlogsInDb[0]._id

        await api
            .put(`/api/blogs/${id}`)
            .send({ ...selectedBlog, likes: newLikes })
            .expect(201)

        const blogAfterUpdate = (
            await BlogModel.find({ title: selectedBlog.title })
        )[0]
        expect((blogAfterUpdate as any).likes).toEqual(newLikes)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
