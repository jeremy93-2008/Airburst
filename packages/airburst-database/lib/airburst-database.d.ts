import knex from "knex";
import { Column } from "./airburst-create-database";
interface IDatabase {
    [x: string]: {
        [x: string]: Column;
    };
}
export declare function createNewDatabase(db: knex<any, unknown[]>, databaseJSON: IDatabase): Promise<void>;
export declare function getDatabaseObject(db: knex<any, any>): void;
export {};
//# sourceMappingURL=airburst-database.d.ts.map