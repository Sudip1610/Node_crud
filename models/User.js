const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post=require('./Posts');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
