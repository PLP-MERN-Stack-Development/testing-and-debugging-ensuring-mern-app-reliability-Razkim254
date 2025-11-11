require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const Post = require('../../src/models/Post');
const User = require('../../src/models/User');
const { generateToken } = require('../../utils/auth');

let token;
let userId;
let postId;
let app;

jest.setTimeout(30000);

const createObjectId = () => new mongoose.Types.ObjectId();

beforeAll(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI in environment');
  }

  await mongoose.connect(process.env.MONGO_URI);

  process.env.PORT = 0;
  app = require('../../server');

  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });

  userId = user._id;
  token = generateToken(user);

  const post = await Post.create({
    title: 'Test Post',
    content: 'This is a test post content',
    author: userId,
    category: createObjectId(),
    slug: 'test-post',
  });

  postId = post._id;
});

beforeEach(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/posts', () => {
  it('should create a new post when authenticated', async () => {
    const newPost = {
      title: 'New Test Post',
      content: 'This is a new test post content',
      category: createObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newPost.title);
    expect(res.body.content).toBe(newPost.content);
    expect(res.body.author).toBe(userId.toString());
  });

  it('should return 401 if not authenticated', async () => {
    const newPost = {
      title: 'Unauthorized Post',
      content: 'This should not be created',
      category: createObjectId().toString(),
    };

    const res = await request(app).post('/api/posts').send(newPost);
    expect(res.status).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    const invalidPost = {
      content: 'Missing title',
      category: createObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidPost);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/posts', () => {
  it('should return all posts', async () => {
    await Post.create({
      title: 'Test Post',
      content: 'This is a test post content',
      author: userId,
      category: createObjectId(),
      slug: 'test-post',
    });

    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter posts by category', async () => {
    const categoryId = createObjectId().toString();

    await Post.create({
      title: 'Filtered Post',
      content: 'Filtered by category',
      author: userId,
      category: categoryId,
      slug: 'filtered-post',
    });

    const res = await request(app).get(`/api/posts?category=${categoryId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category).toBe(categoryId);
  });

  it('should paginate results', async () => {
    const posts = Array.from({ length: 15 }, (_, i) => ({
      title: `Pagination Post ${i}`,
      content: `Content ${i}`,
      author: userId,
      category: createObjectId(),
      slug: `pagination-${i}`,
    }));
    await Post.insertMany(posts);

    const page1 = await request(app).get('/api/posts?page=1&limit=10');
    const page2 = await request(app).get('/api/posts?page=2&limit=10');

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.length).toBe(10);
    expect(page2.body.length).toBeGreaterThan(0);
    expect(page1.body[0]._id).not.toBe(page2.body[0]._id);
  });
});

describe('GET /api/posts/:id', () => {
  it('should return a post by ID', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'This is a test post content',
      author: userId,
      category: createObjectId(),
      slug: 'test-post',
    });

    const res = await request(app).get(`/api/posts/${post._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(post._id.toString());
  });

  it('should return 404 for non-existent post', async () => {
    const fakeId = createObjectId();
    const res = await request(app).get(`/api/posts/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/posts/:id', () => {
  it('should update a post when authenticated as author', async () => {
    const post = await Post.create({
      title: 'Original Title',
      content: 'Original Content',
      author: userId,
      category: createObjectId(),
      slug: 'original-post',
    });

    const updates = { title: 'Updated Title', content: 'Updated Content' };
    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updates.title);
  });

  it('should return 401 if not authenticated', async () => {
    const post = await Post.create({
      title: 'Original Title',
      content: 'Original Content',
      author: userId,
      category: createObjectId(),
      slug: 'original-post',
    });

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .send({ title: 'No Auth' });

    expect(res.status).toBe(401);
  });

  it('should return 403 if not the author', async () => {
    const post = await Post.create({
      title: 'Original Title',
      content: 'Original Content',
      author: userId,
      category: createObjectId(),
      slug: 'original-post',
    });

    const anotherUser = await User.create({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'password123',
    });

    const anotherToken = generateToken(anotherUser);

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .send({ title: 'Forbidden Update' });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('should delete a post when authenticated as author', async () => {
    const post = await Post.create({
      title: 'Delete Me',
      content: 'To be deleted',
      author: userId,
      category: createObjectId(),
      slug: 'delete-me',
    });

    const res = await request(app)
      .delete(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const deleted = await Post.findById(post._id);
    expect(deleted).toBeNull();
  });

  it('should return 401 if not authenticated', async () => {
    const post = await Post.create({
      title: 'Delete Me',
      content: 'To be deleted',
      author: userId,
      category: createObjectId(),
      slug: 'delete-me',
    });

    const res = await request(app).delete(`/api/posts/${post._id}`);
    expect(res.status).toBe(401);
  });
});
