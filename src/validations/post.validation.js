const joi = require('joi');

const CreateArticleSchema = joi.object({
    title: joi.string().min(5).max(200).trim().required(),
    content: joi.string().min(20).required(),
    author: joi.string().trim().optional().default("guest"),
});

const validateArticle = (req, res, next) => {
    console.log(req.body);
    const { error } = CreateArticleSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: error.details[0].message,
        });
    }

    next();
};

const UpdateArticleSchema = joi.object({
    title: joi.string().min(5).max(200).trim(),
    content: joi.string().min(20).trim(),
});

const validateUpdateArticle = (req, res, next) => {
    const { error } = UpdateArticleSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: error.details[0].message,
        });
    }

    next();
};

module.exports = {
    validateArticle,
    validateUpdateArticle,
};