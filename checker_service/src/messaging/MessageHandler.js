"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const checkDomain_1 = require("../components/service/checkDomain");
const MessageHandlerBase_1 = require("../../../common/src/messaging/MessageHandlerBase");
const QueueTypesAndValues_1 = require("../../../common/src/messaging/QueueTypesAndValues");
const domainService = new checkDomain_1.DomainService();
class MessageHandler extends MessageHandlerBase_1.MessageHandlerBase {
    async handleMessage(message) {
        const body = message.body;
        switch (message.value) {
            case QueueTypesAndValues_1.MessageValues.CHECK_DOMAIN:
                return domainService.checkDomain(body);
            case QueueTypesAndValues_1.MessageValues.GET_ALL_DOMAINS:
                return domainService.getAllDomains(body);
            case QueueTypesAndValues_1.MessageValues.GET_DOMAIN_BY_NAME:
                return domainService.getDomainByName(body);
            case QueueTypesAndValues_1.MessageValues.GET_FILE_NAMES:
                return domainService.getFileNames(body);
        }
    }
}
exports.MessageHandler = MessageHandler;
//# sourceMappingURL=MessageHandler.js.map