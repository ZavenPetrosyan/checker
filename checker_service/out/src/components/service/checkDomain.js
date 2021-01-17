"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainService = void 0;
const domain_model_1 = require("../model/domain.model");
const validationDomain_1 = require("./validationDomain");
class DomainService {
    constructor() {
        this.validation = new validationDomain_1.ValidateDomain();
    }
    async getByName(name) {
        if (name) {
            const response = await domain_model_1.DomainModel.findOne({ name });
            return response;
        }
        ;
    }
    async list() {
        const domains = await domain_model_1.DomainModel.findAll();
        return domains;
    }
    async upload(body) {
        await this.validation.detectDomain(body);
    }
}
exports.DomainService = DomainService;
//# sourceMappingURL=checkDomain.js.map