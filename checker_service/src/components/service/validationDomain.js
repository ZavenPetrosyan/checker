"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateDomain = void 0;
const dns = require("dns");
class ValidateDomain {
    detectAddress(data) {
        return new Promise((accept) => {
            dns.resolve4(data, (err, res) => {
                if (err)
                    accept([]);
                accept(res);
            });
        });
    }
    detect(data) {
        return new Promise((accept, reject) => {
            dns.resolveSoa(data, async (err, res) => {
                const lastDetected = Date.now();
                if (err) {
                    accept({
                        name: data,
                        possyblyAvailable: true,
                        lastDetected
                    });
                }
                const addresses = await this.detectAddress(data);
                accept(Object.assign({ name: data, possyblyAvailable: false, addresses,
                    lastDetected }, res));
            });
        });
    }
    isValid(data) {
        if (!data)
            return false;
        return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(data);
    }
    async detectDomain(data) {
        try {
            if (!this.isValid(data))
                return;
            const res = await this.detect(data);
            console.log(res);
            return 'done';
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.ValidateDomain = ValidateDomain;
//# sourceMappingURL=validationDomain.js.map