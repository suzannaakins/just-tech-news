const router = require('express').Router();
const { debugPort } = require('process');
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');

//retrieve ALL posts in the DB. with its user
router.get('/', (req, res) => {
    console.log('=================');
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
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

//get a SINGLE post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//create a NEW post
//POST /api/posts
router.post('/', (req, res) => {
    //expects url, title, user_id(who created it)
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//update when a post gets VOTED on (PUT /api/posts/upvote)
//must be before the /:id PUT route, otherwise express.js will think "upvote" is a valid parameter for /:id
router.put('/upvote', (req, res) => {
    //has TWO queries - 1. use vote model to create vote, 2. query the post to get updated vote count
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
        .then(() => {
            //find the post we just voted on
            return Post.findOne({
                where: {
                    id: req.body.post_id
                },
                attributes: [
                    "id",
                    'post_url',
                    'title',
                    'created_at',
                    //use raw MySQL aggregate function query to get a count of how many votes the post has + return it under the name 'vote_count'
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            })
                .then(dbPostData => res.json(dbPostData))
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        });

    //update a post's TITLE
    router.put('/:id', (req, res) => {
        Post.update(
            {
                title: req.body.title
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )
            .then(dbPostData => {
                if (!dbPostData) {
                    res.status(404).json({ message: 'No post with this id' });
                    return;
                }
                res.json(dbPostData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    });
});

router.delete('/:id', (req, res) => {
    Post.destroy(
        {
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;