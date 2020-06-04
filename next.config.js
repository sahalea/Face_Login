const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    ENV: "development",
    HOST: "localhost",
    PORT: 3000,
    PORT_API: 3001,
  },
};
