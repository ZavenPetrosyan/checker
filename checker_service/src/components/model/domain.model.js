"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainModel = void 0;
const baseModel_1 = require("../../../../common/src/base/baseModel");
class DomainModel extends baseModel_1.BaseModel {
    constructor(data) {
        super();
        this.name = data.name;
        this.retry = data.retry;
        this.expiry = data.expiry;
        this.nsname = data.nsname;
        this.serial = data.serial;
        this.minttl = data.minttl;
        this.addresses = data.addresses;
        this.hostMaster = data.hostMaster;
        this.lastDateCreated = data.lastDateCreated;
        this.possyblyAvaliable = data.possyblyAvaliable;
    }
}
exports.DomainModel = DomainModel;
DomainModel.tableName = 'domain';
//# sourceMappingURL=domain.model.js.map