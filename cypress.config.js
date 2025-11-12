const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5175', // adjust to your MERN app port
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
    },
  },
});
