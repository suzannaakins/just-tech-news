//file that collects + exports User model data

const User = require('./User');
const Post = require('./Post');

//create associations between models
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Post };