"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = exports.RawParam = exports.broker = exports.QueryBuilder = void 0;
const knex = require("knex");
const lodash_1 = require("lodash");
const bluebird_1 = require("bluebird");
const pg = require("pg");
const utils_1 = require("./utils");
const brockerUtil_1 = require("../messaging/brockerUtil");
var types = pg.types;
types.setTypeParser(20, parseInt);
types.setTypeParser(1700, "text", parseFloat);
exports.QueryBuilder = knex({ dialect: "pg", client: "pg" });
exports.broker = brockerUtil_1.BrokerUtil.getBroker();
function RawParam(param) {
    return exports.QueryBuilder.raw("?", [param]);
}
exports.RawParam = RawParam;
class BaseModel {
    static set db_config(value) {
        BaseModel.knex = knex({ dialect: "pg", client: "pg", connection: value, pool: { min: 0, max: 50 } });
    }
    get tableName() {
        return this.constructor.tableName;
    }
    static async manyOrNone(query, model) {
        const raw = await BaseModel.manyOrNoneRaw(query);
        if (!raw.length)
            return [];
        return bluebird_1.map(raw, async (r) => new (model || this)(r));
    }
    static async manyOrNoneRaw(query) {
        query = query.toString();
        const transactionResult = await BaseModel.knex.raw(query);
        return transactionResult.rows;
    }
    static async oneOrNoneRaw(query) {
        query = query.toString();
        const transactionResult = await BaseModel.knex.raw(query);
        const [result] = transactionResult.rows;
        return result;
    }
    static async oneRaw(query) {
        const transactionResult = await BaseModel.knex.raw(query.toString());
        const [result] = transactionResult.rows;
        return result;
    }
    async save(conflictRule) {
        const saved = await BaseModel.save(this, conflictRule, this.constructor);
        lodash_1.merge(this, saved);
        return this;
    }
    static async save(data, conflictRule, model) {
        let query = exports.QueryBuilder.table((model || this).tableName)
            .insert(data)
            .toString();
        if (conflictRule) {
            query += " " + conflictRule;
        }
        query += " returning *;";
        const result = await BaseModel.oneRaw(query);
        return new (model || this)(result);
    }
    async saveWithID(conflictRule) {
        const saved = await BaseModel.saveWithID(this, conflictRule, this.constructor);
        lodash_1.merge(this, saved);
        return this;
    }
    static async saveWithID(data, conflictRule, model) {
        delete data.id;
        delete data.sourceInfo;
        delete data.autoSendLog;
        utils_1.CleanObject(data);
        let query = exports.QueryBuilder.table((model || this).tableName)
            .insert(data)
            .toString();
        if (conflictRule) {
            query += " " + conflictRule;
        }
        query += " returning *;";
        const result = await BaseModel.oneRaw(query);
        return new (model || this)(result);
    }
    static async delete(byFields, model) {
        const clone = lodash_1.cloneDeep(byFields);
        utils_1.CleanObject(byFields);
        const returning = Object.keys(byFields);
        if (returning.length == 0)
            return [];
        const query = exports.QueryBuilder.table((model || this).tableName)
            .where(clone)
            .delete()
            .returning(returning);
        const raw = await BaseModel.manyOrNoneRaw(query);
        if (!raw.length)
            return [];
        return bluebird_1.map(raw, async (r) => new (model || this)(r));
    }
    async delete(byFields = { id: this.id }) {
        return BaseModel.delete(byFields, this.constructor);
    }
    async findOne(fields) {
        return BaseModel.findOne(fields, this.constructor);
    }
    static async findOne(fields, model) {
        const clone = lodash_1.cloneDeep(fields);
        utils_1.CleanObject(clone);
        if (Object.keys(clone).length === 0)
            return;
        const query = exports.QueryBuilder((model || this).tableName)
            .select("*")
            .where(clone)
            .limit(1);
        const result = await BaseModel.oneOrNoneRaw(query);
        if (!result)
            return;
        return new this(result);
    }
    async find(fields) {
        return BaseModel.find(fields, this.constructor);
    }
    static async find(fields, model) {
        const clone = lodash_1.cloneDeep(fields);
        utils_1.CleanObject(clone);
        if (Object.keys(clone).length === 0)
            return [];
        const query = exports.QueryBuilder.table((model || this).tableName)
            .select("*")
            .where(clone)
            .toString();
        const raw = await BaseModel.manyOrNoneRaw(query);
        if (!raw.length)
            return [];
        return bluebird_1.map(raw, async (r) => new (model || this)(r));
    }
}
exports.BaseModel = BaseModel;
BaseModel.tableName = "";
//# sourceMappingURL=baseModel.js.map