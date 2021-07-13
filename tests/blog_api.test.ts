import mongoose from 'mongoose'
import supertest from 'supertest'

import app from '../src/app'
import BlogModel from '../src/models/blog'
import initialBlogs from './blogs'

const api = supertest(app)

beforeEach(async () => {
    await BlogModel.deleteMany({})
    for (const blog of initialBlogs) {
        const blogObject = new BlogModel(blog)
        await blogObject.save()
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

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const currentBlogs = await BlogModel.find({})
        expect(currentBlogs).toHaveLength(initialBlogs.length + 1)
    })

    test('if likes property is missing when making a post request, it will default to 0', async () => {
        const newBlog = {
            title: 'FP vs. OO',
            author: 'Robert C. Martin',
            url: 'https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html',
        }

        const response = await api
            .post('/api/blogs')
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

        await api.post('/api/blogs').send(missingBlog1).expect(400)
        await api.post('/api/blogs').send(missingBlog2).expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
