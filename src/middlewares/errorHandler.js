const multer = require('multer');

const errorhandler = (err, req, res, next) => {
    console.error(err.message);
    const status = err.status || 500;

    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        return res.status(400).json({ error: "Invalid file type or size" });
    }
    res.status(status).json({ error: err.message });
};

module.exports = errorhandler;