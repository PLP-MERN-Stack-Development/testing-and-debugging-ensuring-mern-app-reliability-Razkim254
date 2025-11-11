const slugify = require('../../utils/slugify');

describe('slugify', () => {
  it('converts spaces to dashes and lowercases text', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
});
