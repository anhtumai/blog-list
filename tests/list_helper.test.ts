import listHelper from '../src/utils/list_helper'

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0,
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0,
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0,
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
    },
]

const secondBlogs = [
    ...blogs,
    {
        _id: 'doesnot matter at all',
        title: 'FP vs. OO',
        author: 'Robert C. Martin',
        url: 'https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html',
        likes: 8,
        __v: 0,
    },
]

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0,
        },
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('totalLikes helper when input list of blogs', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {
    test('favoriteBlog helper when input list of blogs', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result.title).toBe('Canonical string reduction')
    })

    test('favoriteBlog helper when input empty list', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toBe(null)
    })
})

describe('most blogs', () => {
    test('most blogs helper when input list of blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result.author).toEqual('Robert C. Martin')
        expect(result.blogs).toEqual(3)
    })
})

describe('most likes', () => {
    test('most likes helper with blogs input', () => {
        const result = listHelper.mostLikes(blogs)
        console.log(blogs)
        expect(result.author).toEqual('Edsger W. Dijkstra')
        expect(result.likes).toEqual(17)
    })
    test('most likes helper with second blogs input ', () => {
        const result = listHelper.mostLikes(secondBlogs)
        console.log(secondBlogs)
        expect(result.author).toEqual('Robert C. Martin')
        expect(result.likes).toEqual(20)
    })
})
