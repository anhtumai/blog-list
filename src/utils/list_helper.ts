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

export default {
    dummy,
    totalLikes,
    favoriteBlog,
}
