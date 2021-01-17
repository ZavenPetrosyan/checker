import * as uuid from "uuid";
import { MessageHandler } from "./messaging/MessageHandler";
import { BaseModel, broker } from "../common/base/baseModel";
import { CONFIG } from "../utils/utils";
import { QueueNames } from "../common/messaging/QueueTypesAndValues";

class Server {
    constructor() {
        this.initBroker();
        this.initDB();
    }

    private async initBroker() {
        await broker.init();
        let queueName = QueueNames.DOMAIN_WORKER;
        let callbackQueue = queueName + "-" + uuid.v4();
        broker.declareQueue(callbackQueue, { autoDelete: true });
        broker.callbackQueue = callbackQueue;
        new MessageHandler(broker, callbackQueue, false);
        new MessageHandler(broker, queueName);
    }

    private initDB() {
        BaseModel.db_config = CONFIG().Databases.Domain.postgres;
    }

}

new Server();

