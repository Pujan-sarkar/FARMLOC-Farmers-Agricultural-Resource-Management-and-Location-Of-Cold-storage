const morgan = require('morgan')
const { config } = require('../configs/config')

const addLogger = (app) => {
    if (config.MODE === 'DEV') {
        app.use(morgan('dev'))
    }
}

module.exports = addLogger
