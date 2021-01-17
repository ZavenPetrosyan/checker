"use strict";
process.on("uncaughtException", error => {
    console.error(error);
});
process.on("warning", warning => {
    console.error(warning);
});
var app = require("./src/app");
var http = require("http");
var config = require("./utils/utils");
var port = normalizePort(config.CONFIG().API.port);
app.set("port", port);
var server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
}
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
//# sourceMappingURL=app.js.map