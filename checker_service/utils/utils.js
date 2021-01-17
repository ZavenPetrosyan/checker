"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePath = exports.ResolveFile = exports.CONFIG = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function CONFIG() {
    return require("../configs/development.json");
}
exports.CONFIG = CONFIG;
exports.ResolveFile = (...args) => {
    const _path = exports.ResolvePath(...args);
    if (fs_1.existsSync(_path))
        return fs_1.readFileSync(_path, {});
    throw new Error(`File at ${_path} does not exist or can't be read`);
};
exports.ResolvePath = (...args) => path_1.resolve(...args);
//# sourceMappingURL=utils.js.map