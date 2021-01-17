"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePath = exports.ResolveFile = exports.CONFIG = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function CONFIG() {
    const data = require("../../configs/development.json");
    const existing = data.Databases.Domain.postgres;
    data.Databases.Domain.postgres = {
        host: process.env.DATABASE_URL || existing.host,
        user: process.env.POSTGRES_USER || existing.user,
        password: process.env.POSTGRES_PASSWORD || existing.password,
        database: process.env.POSTGRES_DB || existing.database,
        port: Number(process.env.POSTGRES_PORT) || existing.port,
        ssl: existing.ssl,
    };
    return data;
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
//# sourceMappingURL=utils.js.map