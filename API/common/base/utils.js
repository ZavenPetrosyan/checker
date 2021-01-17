"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanObject = void 0;
function CleanObject(obj) {
    delete obj.user;
    for (let propName in obj) {
        if (obj[propName] === undefined) {
            delete obj[propName];
        }
        else if (obj[propName] instanceof Date) {
            obj[propName] = obj[propName].toISOString();
        }
    }
}
exports.CleanObject = CleanObject;
//# sourceMappingURL=utils.js.map