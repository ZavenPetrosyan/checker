"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandlerBase = void 0;
class MessageHandlerBase {
    constructor(broker, queueName, ack = true) {
        if (broker) {
            this.broker = broker;
        }
        if (queueName) {
            this.broker.subscribe(queueName, this.handleMessage, undefined, ack);
        }
    }
}
exports.MessageHandlerBase = MessageHandlerBase;
//# sourceMappingURL=MessageHandlerBase.js.map