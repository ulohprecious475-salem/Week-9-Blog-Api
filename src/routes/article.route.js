const express = require('express');
const requireAuth = require("../middlewares/requireAuth");
const { postArticle, getAllArticles, getArticleById, updatedArticleById, deleteArticleById, searchArticles } = require('../controllers/article.controller.js');

const {
    validateArticle,
    validateUpdateArticle,
} = require('../validations/post.validation.js');

const router = express.Router();

router.post('/articles', validateArticle, requireAuth, postArticle);

router.get('/articles', requireAuth, getAllArticles);

router.get('/articles/search', requireAuth, searchArticles);

router.get('/articles/:id', requireAuth, getArticleById);

router.put('/articles/:id', validateUpdateArticle, requireAuth, updatedArticleById);

router.delete('/articles/:id', requireAuth, deleteArticleById);

module.exports = router;