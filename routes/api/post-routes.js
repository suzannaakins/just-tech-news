const router = require('express').Router();
const { debugPort } = require('process');
const { Post, User } = require('../../models');

//retrieve all posts in the DB. get all users
router.get('/', (req, res) => {
    console.log('=================');
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;