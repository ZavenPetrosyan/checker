import * as knex from "knex";
import { merge, cloneDeep } from "lodash";
import { IBase } from "./baseInterface";
import { map } from "bluebird";
import * as pg from "pg";
import { CleanObject } from "./utils";
import { IMessageBroker } from "../messaging/messageBrocker.interface";
import { BrokerUtil } from "../messaging/brockerUtil";

var types = pg.types;
types.setTypeParser(20, parseInt);
types.setTypeParser(1700, "text", parseFloat);

export const QueryBuilder = knex({ dialect: "pg", client: "pg" });
export const broker: IMessageBroker = BrokerUtil.getBroker();

export function RawParam(param: number | string) {
    return QueryBuilder.raw("?", [param]);
}

export type GenericModel<T> = {
    new (...args: any[]): T;
    tableName: string;
    id?: number;
    [value: string]: any;
};

export class BaseModel implements IBase {
    public static tableName = "";
    private static knex: knex;

    public static set db_config(value) {
        BaseModel.knex = knex({ dialect: "pg", client: "pg", connection: value, pool: { min: 0, max: 50 } });
    }

    public get tableName(): string {
        return (<any>this.constructor).tableName;
    }
    public id?: number;

    public static async manyOrNone<T>(this: GenericModel<T> | typeof BaseModel, query, model?: GenericModel<T>): Promise<T[]> {
        const raw = await BaseModel.manyOrNoneRaw(query);
        if (!raw.length) return [];
        return map(raw, async r => new (model || (this as GenericModel<T>))(r));
    }

    public static async manyOrNoneRaw(query): Promise<any[]> {
        query = query.toString();
        const transactionResult = await BaseModel.knex.raw(query);
        return transactionResult.rows;
    }

    public static async oneOrNoneRaw(query): Promise<any | undefined> {
        query = query.toString();
        const transactionResult = await BaseModel.knex.raw(query);
        const [result] = transactionResult.rows;
        return result;
    }

    public static async oneRaw(query): Promise<any | undefined> {
        const transactionResult = await BaseModel.knex.raw(query.toString());
        const [result] = transactionResult.rows;
        return result;
    }

    public async save(conflictRule?: string): Promise<this> {
        const saved = await BaseModel.save<this>(this, conflictRule, this.constructor as GenericModel<this>);
        merge(this, saved);
        return this;
    }

    public static async save<T>(this: GenericModel<T> | typeof BaseModel, data: any, conflictRule?: string, model?: GenericModel<T>): Promise<T> {
        let query = QueryBuilder.table((model || this).tableName)
            .insert(data)
            .toString();
        if (conflictRule) {
            query += " " + conflictRule;
        }
        query += " returning *;";
        const result = await BaseModel.oneRaw(query);
        return new (model || (this as GenericModel<T>))(result);
    }

    public async saveWithID(conflictRule?: string): Promise<this> {
        const saved = await BaseModel.saveWithID<this>(this, conflictRule, this.constructor as GenericModel<this>);
        merge(this, saved);
        return this;
    }

    public static async saveWithID<T>(this: GenericModel<T> | typeof BaseModel, data: any, conflictRule?: string, model?: GenericModel<T>): Promise<T> {
        delete data.id;
        delete data.sourceInfo;
        delete data.autoSendLog;
        CleanObject(data);
        let query = QueryBuilder.table((model || this).tableName)
            .insert(data)
            .toString();
        if (conflictRule) {
            query += " " + conflictRule;
        }
        query += " returning *;";
        const result = await BaseModel.oneRaw(query);
        return new (model || (this as GenericModel<T>))(result);
    }

    public static async delete<T>(this: GenericModel<T> | typeof BaseModel, byFields: any, model?: GenericModel<T>): Promise<T[]> {
        const clone = cloneDeep(byFields);
        CleanObject(byFields);
        const returning = Object.keys(byFields);
        if (returning.length == 0) return [];
        const query = QueryBuilder.table((model || this).tableName)
            .where(clone)
            .delete()
            .returning(returning);
        const raw = await BaseModel.manyOrNoneRaw(query);
        if (!raw.length) return [];
        return map(raw, async r => new (model || (this as GenericModel<T>))(r));
    }

    public async delete(byFields: any = { id: this.id }): Promise<this[]> {
        return BaseModel.delete<this>(byFields, this.constructor as GenericModel<this>);
    }

    public async findOne(fields: this): Promise<this | undefined> {
        return BaseModel.findOne<this>(fields, this.constructor as GenericModel<this>);
    }

    public static async findOne<T>(this: GenericModel<T> | typeof BaseModel, fields: Partial<T>, model?: GenericModel<T>): Promise<T | undefined> {
        const clone = cloneDeep(fields);
        CleanObject(clone);
        if (Object.keys(clone).length === 0) return;

        const query = QueryBuilder((model || this).tableName)
            .select("*")
            .where(clone)
            .limit(1);
        const result = await BaseModel.oneOrNoneRaw(query);
        if (!result) return;
        return new (this as GenericModel<T>)(result);
    }

    public async find(fields: this): Promise<this[]> {
        return BaseModel.find<this>(fields, this.constructor as GenericModel<this>);
    }

    public static async find<T>(this: GenericModel<T> | typeof BaseModel, fields: any, model?: GenericModel<T>): Promise<T[]> {
        const clone = cloneDeep(fields);
        CleanObject(clone);
        if (Object.keys(clone).length === 0) return [];
        const query = QueryBuilder.table((model || this).tableName)
            .select("*")
            .where(clone)
            .toString();
        const raw = await BaseModel.manyOrNoneRaw(query);
        if (!raw.length) return [];
        return map(raw, async r => new (model || (this as GenericModel<T>))(r));
    }
   
    public static async update<T>(
        this: GenericModel<T> | typeof BaseModel,
        // tslint:disable-next-line:no-any
        data: any,
        byFields: object = { id: data.id },
        conflictRule?: string,
        model?: GenericModel<T>
    ): Promise<T | undefined> {
        const clone = cloneDeep(data);
        delete clone.autoSendLog;
        // Object.keys(byFields).forEach(key => delete clone[key]);
        CleanObject(clone);
        if (Object.keys(clone).length == 0) new (model || (this as GenericModel<T>))(this);
        let query = QueryBuilder.table((model || this).tableName)
            .update(clone)
            .where(byFields)
            .toString();

        if (conflictRule) {
            query += " " + conflictRule;
        }
        query += " returning *;";
        const result = await BaseModel.oneRaw(query);
        return result ? new (model || (this as GenericModel<T>))(result) : undefined;
    }

    // tslint:disable-next-line:no-any
    public async update(data: any = this, byFields: any, conflictRule?: string): Promise<this> {
        // merge(this, data);
        Object.assign(this, data);
        return (await BaseModel.update<this>(data, byFields, conflictRule, this.constructor as GenericModel<this>)) || this;
    }
}
