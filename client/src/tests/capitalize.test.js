import { capitalize } from '../utils/capitalize';

test('capitalizes first letter', () => {
  expect(capitalize('bug')).toBe('Bug');
});
