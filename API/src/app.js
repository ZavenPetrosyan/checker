"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const uuid = require("uuid");
const cookieParser = require("cookie-parser");
const check_domain_controller_1 = require("./controllers/check_domain.controller");
const baseModel_1 = require("../../common/src/base/baseModel");
const QueueTypesAndValues_1 = require("../../common/src/messaging/QueueTypesAndValues");
class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.initBroker();
    }
    static server() {
        return new Server();
    }
    config() {
        this.app.use(bodyParser.json({ limit: "5mb" }));
        this.app.use(cookieParser());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(function (err, _req, _res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(function (_req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type ,Authorization");
            res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            next();
        });
    }
    routes() {
        this.app.use("/domain", new check_domain_controller_1.CheckDomainController().router);
    }
    async initBroker() {
        await baseModel_1.broker.init();
        const queueName = QueueTypesAndValues_1.QueueNames.API_WORKER;
        const callbackQueue = queueName + "-" + uuid.v4();
        baseModel_1.broker.declareQueue(callbackQueue, { autoDelete: true });
        baseModel_1.broker.callbackQueue = callbackQueue;
        baseModel_1.broker.subscribe(callbackQueue, undefined, undefined, false);
    }
}
let server = Server.server();
module.exports = server.app;
//# sourceMappingURL=app.js.map