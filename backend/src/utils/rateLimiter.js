const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    max: 300,
    windowMs: 60 * 20 * 1000,
    handler: (req, res) => {
        const timeUntilReset = Math.ceil(
            (limiter.windowMs - (Date.now() - req.rateLimit.resetTime)) / 1000
        )
        const message = `Too many requests from this IP address. Please try again after ${timeUntilReset} seconds.`

        res.status(429).json({
            success: false,
            error: {
                message: message,
                timeUntilReset: timeUntilReset,
            },
        })
    },
})

module.exports = limiter
