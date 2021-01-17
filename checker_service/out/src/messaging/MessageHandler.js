"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const checkDomain_1 = require("../components/service/checkDomain");
const MessageHandlerBase_1 = require("../../common/messaging/MessageHandlerBase");
const QueueTypesAndValues_1 = require("../../common/messaging/QueueTypesAndValues");
const domainService = new checkDomain_1.DomainService();
class MessageHandler extends MessageHandlerBase_1.MessageHandlerBase {
    async handleMessage(message) {
        const body = message.body;
        switch (message.value) {
            case QueueTypesAndValues_1.MessageValues.UPLOAD_DOMAIN:
                return domainService.upload(body);
            case QueueTypesAndValues_1.MessageValues.GET_ALL:
                return domainService.list();
            case QueueTypesAndValues_1.MessageValues.GET_BY_NAME:
                return domainService.getByName(body.name);
        }
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map