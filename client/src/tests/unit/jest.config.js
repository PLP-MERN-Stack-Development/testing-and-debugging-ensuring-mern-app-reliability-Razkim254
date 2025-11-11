export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/src/tests/unit/**/*.test.jsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
