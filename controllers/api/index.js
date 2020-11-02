//this files serves as a means to collect all of the API routes + package them up for us

const router = require('express').Router();

const models = require('../../models/index.js');
const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes.js');
const commentRoutes = require('./comment-routes.js');
const { route } = require('./comment-routes.js');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
