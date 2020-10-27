//file that collects + exports User model data

const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

//create associations between models

//one-to-many relationship between user and posts:
//user can have post MANY articles....
User.hasMany(Post, {
    foreignKey: 'user_id'
});
//but posts can only be posted by ONE user 
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

//many-to-many relationship between votes and users/posts:

//posts can have MANY users who VOTED on them
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

//users can have MANY posts that they VOTED on
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

//direct relationship between user and vote - counts that user's votes?
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

//direct relationship between post and vote - to see total number of vote on a post
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };