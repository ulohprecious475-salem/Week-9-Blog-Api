const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    content: {
        type: String,
        required: true,
        minlength: 20
    },
    author: {
        type: String,
        default: "guest"
    }
}, { timestamps: true });

articleSchema.index({
    title: "text",
    content: "text"
});

module.exports = mongoose.model("Article", articleSchema);