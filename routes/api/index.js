//this files serves as a means to collect all of the API routes + package them up for us

const router = require('express').Router();

const models = require('../../models/index.js');
const userRoutes = require('./user-routes.js');

router.use('/users', userRoutes);

module.exports = router;
