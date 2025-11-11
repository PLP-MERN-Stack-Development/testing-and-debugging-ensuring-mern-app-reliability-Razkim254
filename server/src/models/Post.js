const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  slug:     { type: String, required: true, unique: true },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
