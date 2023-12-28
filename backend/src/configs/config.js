const dotenv = require('dotenv')

dotenv.config()

const config = {
    PORT: process.env.PORT || 5050,
    MONGOURI: process.env.MONGOURI,
    MODE: process.env.MODE,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
}

module.exports = { config }
