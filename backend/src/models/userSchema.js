const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        cpassword: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

userSchema.pre('save', async function (next) {
    const user = this

    if (!user.isModified('password') && !user.isModified('cpassword')) {
        return next()
    }

    try {
        const salt = await bcrypt.genSalt(10)

        if (user.isModified('password')) {
            const hashedPassword = await bcrypt.hash(user.password, salt)
            user.password = hashedPassword
        }

        if (user.isModified('cpassword')) {
            const hashedCPassword = await bcrypt.hash(user.cpassword, salt)
            user.cpassword = hashedCPassword
        }

        return next()
    } catch (error) {
        return next(error)
    }
})

const UserModel = model('users', userSchema)

module.exports = UserModel
