export interface IBase {
    save(conflictRule?: string): Promise<any>;
    saveWithID(conflictRule?: string): Promise<any>;
    delete(byFields?: any): Promise<any>;
    findOne(fields: any): Promise<any | undefined>;
};
