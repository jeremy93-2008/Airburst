import knex from "knex";

type DataType = "increment" | "string" | "integer" | "uinteger" | "text" | "boolean";

export type Column = {
    type?: "primary" | "unique",
    data: DataType,
    ref?: {
        table: string,
        column: string;
    }
} | DataType;

export function createTableIfNoExist(db: knex<any, unknown[]>, name: string, callback: (newTable: knex.TableBuilder) => void) {
    return new Promise((resolve, reject) => {
        db.schema.hasTable(name).then(isExist => {
            if(isExist) return resolve("Table already exist");
            db.schema.createTable(name, newTable => callback(newTable)).then(() => {
                resolve("Table created")
            });
        })
    }) as Promise<string>
}

export function createColumnsIfNoExist(table: knex.TableBuilder, name: string, column: Column) {
    if(typeof column == "string")
        return addColumnByType(table, name, column);
    
    let col = addColumnByType(table, name, column.data);
    
    if(column.type && column.type == "primary") {
        col = col.primary();
    } else if(column.type && column.type == "unique") {
        col = col.unique();
    }

    if(column.ref) {
        table.foreign(name).references(column.ref.column).inTable(column.ref.table)
    }
}

function addColumnByType(table: knex.TableBuilder, name: string, type: DataType) {
    switch(type) {
        case "increment": return table.increments(name);
        case "boolean": return table.boolean(name);
        case "integer": return table.integer(name);
        case "string": return table.string(name);
        case "text": return table.text(name);
        case "uinteger": return table.integer(name).unsigned();
    }
}