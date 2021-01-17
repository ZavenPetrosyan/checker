"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerUtil = void 0;
const AmqpBrocker_1 = require("./AmqpBrocker");
class BrokerUtil {
    static getBroker() {
        if (this.broker == null) {
            this.broker = new AmqpBrocker_1.AmqpBroker();
        }
        return this.broker;
    }
}
exports.BrokerUtil = BrokerUtil;
//# sourceMappingURL=brockerUtil.js.map