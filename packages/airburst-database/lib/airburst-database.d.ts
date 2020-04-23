import knex from "knex";
import { Column } from "./airburst-create-database";
interface IDatabase {
    [x: string]: {
        [x: string]: Column;
    };
}
interface ISample {
    table: string;
    data: {
        [x: string]: string;
    }[];
}
export declare function createNewDatabase(db: knex<any, unknown[]>, databaseJSON: IDatabase): Promise<void>;
export declare function generateSampleDatabase(db: knex<any, unknown[]>, sample: ISample[]): Promise<void>;
export {};
//# sourceMappingURL=airburst-database.d.ts.map