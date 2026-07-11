const express = require('express');

const { postArticle, getAllArticles, getArticleById, updatedArticleById, deleteArticleById, searchArticles } = require('../controllers/article.controller.js');

const router = express.Router();

router.post('/articles', postArticle);

router.get('/articles', getAllArticles);

router.get('/articles/search', searchArticles);

router.get('/articles/:id', getArticleById);

router.put('/articles/:id', updatedArticleById);

router.delete('/articles/:id', deleteArticleById);

module.exports = router;