const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env:{
    username: 'zeleznyik.mateDEV@gmail.com',
    password: 'q4l-al0!DEV',
    apiUrl:'https://conduit-api.bondaracademy.com/api'
  },

  e2e: {
    baseUrl: "https://conduit.bondaracademy.com/",
    setupNodeEvents(on, config) {
      config.env.username = process.env.USER_NAME,
      config.env.password = process.env.PASSWORD
      return config
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});
