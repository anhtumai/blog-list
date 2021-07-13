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

    console.log(response.body)
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

afterAll(() => {
    mongoose.connection.close()
})
