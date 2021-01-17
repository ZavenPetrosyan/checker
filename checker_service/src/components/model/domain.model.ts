import { BaseModel, QueryBuilder } from "../../../common/base/baseModel";
import { IDomain } from "../interfaces/domain";

export class DomainModel extends BaseModel implements IDomain {
    public static tableName = 'domain';
    public id?: number;
    public name: string;
    public retry?: number;
    public serial?: number;
    public nsname?: string;
    public min_ttl?: number;
    public expiry?: number;
    public refresh?: number;
    public host_master?: string;
    public addresses?: string[];
    public last_detected?: number;
    public possybly_available?: boolean;

    constructor(data: IDomain) {
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

    public static async findAll(): Promise<Array<IDomain>> {
        const query = QueryBuilder(this.tableName);
        return DomainModel.manyOrNone(query);
    }

    public static async upsert(data: IDomain): Promise<void> {
        data = new DomainModel(data);
        const domain = await this.findOne({ name: data.name });
        if (domain) {
            await domain.update(data, { id: domain.id });
        } else await new DomainModel(data).save();
    }
}