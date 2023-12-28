const catchError = require('../utils/catchError')
const UserModel = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { config } = require('../configs/config')

const testRoute = catchError(async (req, res) => {
    res.json({ success: true, message: 'API IS WORKING 🥳' })
})

const login = catchError(async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid credentials',
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            })
        }
        const token = jwt.sign({ userId: user._id }, config.JWT_SECRET)
        const expireTime = parseInt(config.JWT_COOKIE_EXPIRES_IN)

        const cookieOptions = {
            expires: new Date(Date.now() + expireTime * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            sameSite: 'strict',
        }
        res.cookie('jwt', token, cookieOptions)
        user.password = undefined
        user.cpassword = undefined
        res.setHeader('Authorization', `Bearer ${token}`)

        res.status(200).json({ success: true, data: user, jwt_token: token })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
})

const register = catchError(async (req, res) => {
    const { name, email, password, cpassword } = req.body

    if (
        !name ||
        !email ||
        !password ||
        !cpassword ||
        !validator.isEmail(email)
    ) {
        return res
            .status(400)
            .json({ message: 'Invalid input data!', success: false })
    }
    const checkUser = await UserModel.findOne({ email })
    if (checkUser) {
        return res
            .status(409)
            .json({ success: false, message: 'User already exists!' })
    }
    try {
        const user = new UserModel({
            name,
            email,
            password,
            cpassword,
        })
        await user.save()
        return res.status(201).json({
            message: 'Registration successful!',
            success: true,
            userId: user._id,
        })
    } catch (error) {
        console.error('Registration error:', error)
        return res
            .status(500)
            .json({ message: 'Registration failed!', success: false })
    }
})

module.exports = { testRoute, login, register }
