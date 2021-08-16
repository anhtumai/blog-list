import mongoose from 'mongoose'

export interface CommentDocument extends mongoose.Document {
    content: string
    blog: string
}

const commentSchema = new mongoose.Schema<CommentDocument>({
    content: {
        type: String,
        required: true,
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    },
})

commentSchema.set('toJSON', {
    transform: (document: any, returnedObject: CommentDocument) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

const CommentModel = mongoose.model<CommentDocument>('Comment', commentSchema)

export default CommentModel
