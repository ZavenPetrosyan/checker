import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { Response } from "express";
import { ErrorCodes } from "../common/messaging/errorCodes";

export function CONFIG() {
    return require("../../configs/development.json");
}

export const ResolveFile = (...args: string[]): Buffer => {
    const _path = ResolvePath(...args);
    if (existsSync(_path)) return readFileSync(_path, {});
    throw new Error(`File at ${_path} does not exist or can't be read`);
};

export const ResolvePath = (...args: string[]) => resolve(...args);

export function RespondWithJson(response: Response, data: object = {}, status = ErrorCodes.OK, ...args: object[]) {
    if (response.headersSent) return;
    return response.status(status).json(
        Object.assign({}, {
            status: status,
            timestamp: new Date().toUTCString()
        }, ...args, { data })
    ).end();
}