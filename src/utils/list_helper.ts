import * as _ from 'lodash'

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

export default {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}
