const globalErrorHandler = (err, req, res) => {
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Internal Server Error',
    })
}

module.exports = globalErrorHandler
