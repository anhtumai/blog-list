import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface UserDocument extends mongoose.Document {
    username: string
    name: string
    passwordHash: string
}

const userSchema = new mongoose.Schema<UserDocument>({
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

const UserModel = mongoose.model('User', userSchema)

export default UserModel
