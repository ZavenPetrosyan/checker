import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

export function CONFIG() {
    const data = require("../../configs/development.json");
    const existing = data.Databases.Domain.postgres;
    data.Databases.Domain.postgres = {
        host: process.env.DATABASE_URL || existing.host,
        user: process.env.POSTGRES_USER || existing.user,
        password: process.env.POSTGRES_PASSWORD || existing.password,
        database: process.env.POSTGRES_DB || existing.database,
        port: Number(process.env.POSTGRES_PORT) || existing.port,
        ssl: existing.ssl,
    }
    return data;
}

export const ResolveFile = (...args: string[]): Buffer => {
    const _path = ResolvePath(...args);
    if (existsSync(_path)) return readFileSync(_path, {});
    throw new Error(`File at ${_path} does not exist or can't be read`);
};

export const ResolvePath = (...args: string[]) => resolve(...args);
