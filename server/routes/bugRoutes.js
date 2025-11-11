const express = require('express');
const router = express.Router();

// Temporary route for testing
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  res.status(201).json({ title });
});

module.exports = router;
