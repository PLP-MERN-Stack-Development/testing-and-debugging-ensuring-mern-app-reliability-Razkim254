const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: mongoose.Schema.Types.ObjectId,
  slug: String,
});

module.exports = mongoose.model('Post', postSchema);
