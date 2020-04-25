import knex from "knex";
import { Column } from "./airburst-create-database";
interface IDatabase {
    [x: string]: {
        [x: string]: Column;
    };
}
export interface ISample {
    table: string;
    data: {
        [x: string]: string | null;
    }[];
}
export declare function createNewDatabase(db: knex<any, unknown[]>, databaseJSON: IDatabase): Promise<void>;
export {};
//# sourceMappingURL=airburst-database.d.ts.map