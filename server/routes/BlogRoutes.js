const express = require('express');
const router = express.Router();
const blogController = require('../controllers/BlogController');

/**
 * App Routes  
*/
router.get('/', blogController.homepage);
router.get('/subscribe', blogController.subscribe);
router.post('/subscribe-mail', blogController.subscribeMail);
router.get('/interview/:id', blogController.exploreInterviews);
router.get('/categories', blogController.exploreCategories);
router.get('/categories/:id', blogController.exploreCategoriesById);
router.post('/search', blogController.searchBlog);
router.get('/explore-latest', blogController.exploreLatest);
router.get('/explore-random', blogController.exploreRandom);
router.get('/submit-interview', blogController.submitBlog);
router.post('/submit-interview', blogController.submitBlogOnPost);


module.exports = router;