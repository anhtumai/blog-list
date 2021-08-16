import mongoose from 'mongoose'

export interface BlogDocument extends mongoose.Document {
    title: string
    author: string
    url: string
    likes: number
    user: string
    comments: string[]
}

const blogSchema = new mongoose.Schema<BlogDocument>({
    title: {
        type: String,
        required: true,
        minlength: 5,
    },
    author: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
})

blogSchema.set('toJSON', {
    transform: (document: any, returnedObject: BlogDocument) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

const BlogModel = mongoose.model<BlogDocument>('Blog', blogSchema)

export default BlogModel
