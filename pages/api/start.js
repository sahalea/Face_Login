const api = require("./").handler;

let config = require("../../next.config.js");

const host = config.env.HOST || "localhost";
const port = config.env.PORT_API || 3001;

// Listen the server
api.listen(port, host);

console.log(`API listening on http://${host}:${port}`);
