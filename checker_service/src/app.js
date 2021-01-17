"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const MessageHandler_1 = require("./messaging/MessageHandler");
const baseModel_1 = require("../../common/src/base/baseModel");
const utils_1 = require("../../API/src/utils/utils");
const QueueTypesAndValues_1 = require("../../common/src/messaging/QueueTypesAndValues");
class Server {
    constructor() {
        this.initBroker();
        this.initDB();
    }
    async initBroker() {
        await baseModel_1.broker.init();
        let queueName = QueueTypesAndValues_1.QueueNames.DOMAIN_WORKER;
        let callbackQueue = queueName + "-" + uuid.v4();
        baseModel_1.broker.declareQueue(callbackQueue, { autoDelete: true });
        baseModel_1.broker.callbackQueue = callbackQueue;
        new MessageHandler_1.MessageHandler(baseModel_1.broker, callbackQueue, false);
        new MessageHandler_1.MessageHandler(baseModel_1.broker, queueName);
    }
    initDB() {
        baseModel_1.BaseModel.db_config = utils_1.CONFIG().Databases.Domain.postgres;
    }
}
new Server();
//# sourceMappingURL=app.js.map