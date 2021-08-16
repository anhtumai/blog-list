import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface UserDocument extends mongoose.Document {
    username: string
    name: string
    passwordHash: string
    blogs: string[]
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
        },
    ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document: any, returnedObject: UserDocument) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    },
})

const UserModel = mongoose.model<UserDocument>('User', userSchema)

export default UserModel
