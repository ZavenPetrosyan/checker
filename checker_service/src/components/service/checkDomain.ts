import { IDomain } from "../interfaces/domain";
import { DomainModel } from "../model/domain.model";
import { ValidateDomain } from "./validationDomain";

export class DomainService {
    private validation: ValidateDomain;
    
    constructor() {
        this.validation = new ValidateDomain();
    }

    public async getByName(name: string): Promise<IDomain | undefined> {
        if (name) {
            const response = await DomainModel.findOne({ name });
            return response;
        };
    }

    public async list(): Promise<Array<IDomain>> {
        const domains = await DomainModel.findAll();
        return domains;
    }

    public async upload(body): Promise<any> {
        await this.validation.detectDomain(body);
    }

}