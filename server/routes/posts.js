const express = require('express');
const router = express.Router();
const Post = require('../src/models/Post');
const jwt = require('jsonwebtoken');

// ✅ Fake auth middleware for tests
router.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'test' &&
    req.headers.authorization?.startsWith('Bearer ')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
    } catch (err) {
      // Ignore token errors in test mode
    }
  }
  next();
});

// ✅ Create post
router.post('/', async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { title, content, category } = req.body;
    const author = req.user.id;
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const post = await Post.create({ title, content, category, author, slug });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all posts (with optional category + pagination)
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = category ? { category } : {};
    const posts = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get post by ID
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.status(200).json(post);
});

// ✅ Update post
router.put('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.id !== post.author.toString()) return res.status(403).json({ error: 'Forbidden' });

  Object.assign(post, req.body);
  await post.save();
  res.status(200).json(post);
});

// ✅ Delete post
router.delete('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.id !== post.author.toString()) return res.status(403).json({ error: 'Forbidden' });

  await post.deleteOne();
  res.status(200).json({ message: 'Post deleted' });
});

module.exports = router;
