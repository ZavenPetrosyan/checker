"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmqpBroker = void 0;
const amqp_ts_async_1 = require("amqp-ts-async");
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const utils_1 = require("../../utils/utils");
const errorCodes_1 = require("./errorCodes");
const Amqp = require("amqp-ts-async");
const CONF = utils_1.CONFIG();
const connectionString = process.env.MESSAGE_QUEUE || `${CONF.rabbit.url}?heartbeat=${CONF.rabbit.heartbeat}`;
const connection = new Amqp.Connection(connectionString);
class AmqpBroker {
    constructor() {
        this.requestPromise = {};
    }
    declareQueue(name, options) {
        return connection.declareQueue(name, options);
    }
    init() {
        return connection.completeConfiguration();
    }
    sendRequest(value, body, queueName, ip) {
        return new Promise((res, rej) => {
            const reqId = uuid_1.v4();
            this.requestPromise[reqId] = { resolve: res, reject: rej };
            const message = new amqp_ts_async_1.Message({ value: value, body: body, ip: ip });
            message.properties.replyTo = this.callbackQueue;
            message.properties.correlationId = reqId;
            connection.declareQueue(queueName, { noCreate: true }).send(message);
        });
    }
    async sendResponse(action, body, message, queueName) {
        const reply = await action(body).then(result => {
            const reply = {
                errorCode: 0,
                response: result
            };
            return reply;
        }, error => {
            const reply = {
                errorCode: -1,
                response: error.message || error,
                stack: error.stack
            };
            if (lodash_1.isNumber(reply.response)) {
                reply.response = errorCodes_1.ErrorCodes[lodash_1.toNumber(reply.response)];
            }
            this.sendError(error, message.getContent(), queueName + "_exception");
            return reply;
        });
        const replyMessage = new amqp_ts_async_1.Message(reply);
        replyMessage.properties.correlationId = message.properties.correlationId;
        return replyMessage;
    }
    sendError(error, body, queueName) {
        const errorMessage = new amqp_ts_async_1.Message({
            exception: error.message,
            stack: error.stack,
            onMessage: body,
            to: queueName,
            date: new Date().toUTCString()
        });
        const queue = connection.declareQueue(queueName);
        queue.send(errorMessage);
    }
    async subscribe(queueName, callback, exchange, ack = true) {
        let queue = connection.declareQueue(queueName, { prefetch: 1000 });
        if (exchange) {
            await queue.bind(exchange);
        }
        queue.activateConsumer(async (message) => {
            const body = message.getContent();
            const correlationId = message.properties.correlationId;
            const def = this.requestPromise[correlationId];
            if (correlationId && def) {
                if (body.errorCode == 0) {
                    def.resolve(body.response);
                }
                else {
                    def.reject(body.response);
                }
                delete this.requestPromise[correlationId];
            }
            else {
                if (callback == null) {
                    return new amqp_ts_async_1.Message();
                }
                else {
                    const response = await this.sendResponse(callback, body, message, queueName);
                    if (ack)
                        message.ack();
                    return response;
                }
            }
        }, { noAck: !ack });
    }
}
exports.AmqpBroker = AmqpBroker;
//# sourceMappingURL=AmqpBrocker.js.map