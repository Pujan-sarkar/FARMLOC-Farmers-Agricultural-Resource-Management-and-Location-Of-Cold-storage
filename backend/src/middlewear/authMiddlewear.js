const jwt = require('jsonwebtoken')
const config = require('../configs/config')

const protect = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided',
            })
        }

        const decoded = jwt.verify(token, config.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.error('Authentication error:', error)
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token',
        })
    }
}

module.exports = protect
