"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespondWithJson = exports.ResolvePath = exports.ResolveFile = exports.CONFIG = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const errorCodes_1 = require("../common/messaging/errorCodes");
function CONFIG() {
    return require("../../configs/development.json");
}
exports.CONFIG = CONFIG;
const ResolveFile = (...args) => {
    const _path = exports.ResolvePath(...args);
    if (fs_1.existsSync(_path))
        return fs_1.readFileSync(_path, {});
    throw new Error(`File at ${_path} does not exist or can't be read`);
};
exports.ResolveFile = ResolveFile;
const ResolvePath = (...args) => path_1.resolve(...args);
exports.ResolvePath = ResolvePath;
function RespondWithJson(response, data = {}, status = errorCodes_1.ErrorCodes.OK, ...args) {
    if (response.headersSent)
        return;
    return response.status(status).json(Object.assign({}, {
        status: status,
        timestamp: new Date().toUTCString()
    }, ...args, { data })).end();
}
exports.RespondWithJson = RespondWithJson;
//# sourceMappingURL=utils.js.map