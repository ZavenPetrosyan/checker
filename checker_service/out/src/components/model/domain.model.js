"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainModel = void 0;
const baseModel_1 = require("../../../common/base/baseModel");
class DomainModel extends baseModel_1.BaseModel {
    constructor(data) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.retry = data.retry;
        this.expiry = data.expiry;
        this.nsname = data.nsname;
        this.serial = data.serial;
        this.min_ttl = data.min_ttl;
        this.addresses = data.addresses;
        this.host_master = data.host_master;
        this.last_detected = data.last_detected;
        this.possybly_available = data.possybly_available;
    }
    static async findAll() {
        const query = baseModel_1.QueryBuilder(this.tableName);
        return DomainModel.manyOrNone(query);
    }
    static async upsert(data) {
        data = new DomainModel(data);
        const domain = await this.findOne({ name: data.name });
        if (domain) {
            await domain.update(data, { id: domain.id });
        }
        else
            await new DomainModel(data).save();
    }
}
exports.DomainModel = DomainModel;
DomainModel.tableName = 'domain';
//# sourceMappingURL=domain.model.js.map