import * as _ from 'lodash'
import { max } from 'lodash'

export interface Blog {
    _id: string
    title: string
    author: string
    url: string
    likes: number
    __v: number
}

function dummy(blogs: Blog[]) {
    return 1
}

function totalLikes(blogs: Blog[]) {
    return blogs.reduce(
        (accumulator, currentValue) => accumulator + currentValue.likes,
        0
    )
}

function favoriteBlog(blogs: Blog[]) {
    if (blogs.length === 0) return null
    return blogs.reduce(
        (prevBlog, currentBlog) =>
            prevBlog.likes < currentBlog.likes ? currentBlog : prevBlog,
        blogs[0]
    )
}

type AuthorWithBlogsNum = {
    author: string
    blogs: number
}

function mostBlogs(blogs: Blog[]): AuthorWithBlogsNum | null {
    if (blogs.length === 0) return null
    const [author, numberOfBlogs] = _.chain(_.map(blogs, 'author'))
        .countBy()
        .toPairs()
        .maxBy(_.last)
        .value()
    return {
        author: String(author),
        blogs: Number(numberOfBlogs),
    }
}
type AuthorWithLikes = {
    author: string
    likes: number
}

function mostLikes(blogs: Blog[]): AuthorWithLikes | null {
    if (blogs.length === 0) return null
    let author = blogs[0].author
    let maxLikes = blogs[0].likes
    const likesMap = new Map<string, number>()

    for (const blog of blogs) {
        if (likesMap.has(blog.author)) {
            likesMap.set(blog.author, likesMap.get(blog.author) + blog.likes)
        } else {
            likesMap.set(blog.author, blog.likes)
        }
        if (likesMap.get(blog.author) > maxLikes) {
            maxLikes = likesMap.get(blog.author)
            author = blog.author
        }
    }

    return {
        author,
        likes: maxLikes,
    }
}
export default {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}
