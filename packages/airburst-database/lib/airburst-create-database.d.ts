import knex from "knex";
declare type DataType = "increment" | "string" | "integer" | "date" | "uinteger" | "text" | "boolean";
export declare type Column = {
    type?: "primary" | "unique";
    data: DataType;
    ref?: {
        table: string;
        column: string;
    };
} | DataType;
export declare function createTableIfNoExist(db: knex<any, unknown[]>, name: string, callback: (newTable: knex.TableBuilder) => void): Promise<string>;
export declare function createColumnsIfNoExist(table: knex.TableBuilder, name: string, column: Column): knex.ColumnBuilder | undefined;
export {};
//# sourceMappingURL=airburst-create-database.d.ts.map