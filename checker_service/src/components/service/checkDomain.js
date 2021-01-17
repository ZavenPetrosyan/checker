"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainService = void 0;
class DomainService {
    async getFileNames(body) {
        console.log(body);
        return "QAQ";
    }
    async getDomainByName(body) {
        throw new Error("Method not implemented.");
    }
    async getAllDomains(body) {
        throw new Error("Method not implemented.");
    }
    async checkDomain(body) {
        return 0;
    }
}
exports.DomainService = DomainService;
//# sourceMappingURL=checkDomain.js.map