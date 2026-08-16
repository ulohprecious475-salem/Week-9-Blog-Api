
const ArticleModel = require('../models/article.model.js');

const postArticle = async (req, res, next) => {
    try {
        const {title, content, author} = value;
        const newArticle = new ArticleModel({
            
            title: req.body.title, 
            content: req.body.content,
            author: req.user._id
        });
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
        const articles = await ArticleModel.find().populate('author', 'username email').skip(skip).limit(limit);
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
    try {
        // Find the article first
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: `Article with ID ${req.params.id} not found`
            });
        }

        // Ownership check
        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to update this article."
            });
        }

        // Update only if the user owns the article
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
             req.params.id,
    req.body,
         {
            new: true,
            runValidators: true
          }
        );

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
        // Find the article first
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: `Article with ID ${req.params.id} not found`
            });
        }

        // Ownership check
        if (article.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this article."
            });
        }

        // Delete the article
        await article.deleteOne();

        return res.status(200).json({
            message: "Article deleted successfully"
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