import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

export function CONFIG() {
    return require("../configs/development.json");
}

export const ResolveFile = (...args: string[]): Buffer => {
    const _path = ResolvePath(...args);
    if (existsSync(_path)) return readFileSync(_path, {});
    throw new Error(`File at ${_path} does not exist or can't be read`);
};

export const ResolvePath = (...args: string[]) => resolve(...args);
