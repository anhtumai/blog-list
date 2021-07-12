import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export interface BlogDocument extends mongoose.Document {
    title: string
    author: string
    url: string
    likes: number
}

const url = process.env.MONGODB_URI

mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
    })
    .then((result) => {
        console.log('Connect to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
})

blogSchema.set('toJSON', {
    transform: (document: any, returnedObject: any) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

const BlogModel = mongoose.model('Blog', blogSchema)

export default BlogModel
