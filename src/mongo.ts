import mongoose, { Document } from 'mongoose'

interface BlogDocument extends Document {
    title: string
    author: string
    url: string
    likes: number
}

function addNewBlog(
    title: string,
    author: string,
    url: string,
    likes: number,
    Blog: mongoose.Model<BlogDocument, {}, {}>
): void {
    const blog = new Blog({
        title,
        author,
        url,
        likes,
    })

    blog.save().then((result) => {
        console.log(`Added ${title} ${author} ${url} ${likes} to phonebook`)
        mongoose.connection.close()
    })
}

function listAllRecords(Blog: mongoose.Model<BlogDocument, {}, {}>): void {
    Blog.find({}).then((result) => {
        console.log('phonebook:')
        result.forEach((record) => {
            console.log(`${record}`)
        })
        mongoose.connection.close()
    })
}

function main() {
    const argsNum = process.argv.length

    if (argsNum !== 3 && argsNum !== 7) {
        console.log(
            'Valid commands: `node build/mongo.js <password>` or `node build/mongo.js <password> <title> <author> <url> <likes>`'
        )
        process.exit(1)
    }

    const password = process.argv[2]

    const url = `mongodb+srv://fullstack:${password}@cluster0.awmni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

    try {
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
    } catch (err) {
        console.log(err)
        process.exit(1)
    }

    const blogSchema = new mongoose.Schema({
        title: String,
        author: String,
        url: String,
        likes: Number,
    })

    const Blog = mongoose.model<BlogDocument>('Blog', blogSchema)

    if (argsNum === 3) {
        listAllRecords(Blog)
    } else {
        addNewBlog(
            process.argv[3],
            process.argv[4],
            process.argv[5],
            Number(process.argv[6]),
            Blog
        )
    }
}

main()
