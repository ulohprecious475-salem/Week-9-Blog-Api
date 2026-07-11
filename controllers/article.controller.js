const joi = require('joi');

const ArticleModel = require('../models/article.model.js');

const postArticle = async (req, res, next) => {

const articleSchema = joi.object({
    title: joi.string().min(5).required(),
    content: joi.string().min(20).required(),
    author: joi.string().optional().default("guest")
});

const {error ,value} = articleSchema.validate(req.body);

if (error) {
    console.error(error);
    return res.status(400).json({ message: "please provide article title and content", error });
}


    try {
        const {title, content, author} = value;
        const newArticle = new ArticleModel({ title, content, author: author || "guest" });
        await newArticle.save();

        return res.status(201).json({
            message: "Article created successfully",
            data: newArticle
        })
        } catch (error) {

        console.error(error);
        next(error);
    }
};

const getAllArticles = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page -1) * limit;
    try {
        const articles = await ArticleModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        return res.status(200).json({
            message: "Articles retrieved successfully",
            data: articles
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: `Article with ${req.params.id} not found` });
        }
        return res.status(200).json({
            message: "Article retrieved successfully",
            data: article
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const updatedArticleById = async (req, res, next) => {

    const articleSchema = joi.object({
    title: joi.string().min(5).optional(),
    content: joi.string().min(20).optional(),
    author: joi.string().optional()
});

const {error ,value} = articleSchema.validate(req.body);
if (error) {
    return res.status(400).json({ message: "please provide article title and content",});
}

    try {
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
             {...value}, 
             { 
                new: true, 
                runValidators: true });
        if (!updatedArticle) {
            return res.status(404).json({ message: `Article with ${req.params.id} not found` });
        }
        return res.status(200).json({
            message: "Article updated successfully",
            data: updatedArticle
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const deleteArticleById = async (req, res, next) => {
    try {
        const deletedArticle = await ArticleModel.findByIdAndDelete(req.params.id);
        if (!deletedArticle) {
            return res.status(404).json({ message: `Article with ${req.params.id} not found` });
        }
        return res.status(200).json({
            message: "Article deleted successfully",
            data: deletedArticle
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const searchArticles = async (req, res, next) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Please provide a search keyword."
            });
        }

        const articles = await ArticleModel.find({
            $text: { $search: q }
        });

        return res.status(200).json({
            message: "Search successful",
            data: articles
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    postArticle,
    getAllArticles,
    getArticleById,
    searchArticles,
    updatedArticleById,
    deleteArticleById
};