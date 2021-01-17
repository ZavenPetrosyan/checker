import { IBase } from "../../../common/base/baseInterface";

export interface IDomain extends IBase {
    id?: number;
    name: string;
    expiry?: number;
    last_detected?: number;
    possybly_available?: boolean;
    addresses?: string[];
    nsname?: string;
    host_master?: string;
    serial?: number;
    refresh?: number;
    retry?: number;
    min_ttl?: number
}