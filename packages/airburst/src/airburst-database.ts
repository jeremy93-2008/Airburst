import knex from "knex";
import Database from "./config/database.json";

export function createTablesIfNotExist(db: knex<any, unknown[]>) {
    Object.keys(Database).forEach((tableName) => {
        db.schema.createTableIfNotExists(tableName, (newTable) => {
            createColumnIfNotExist(newTable, tableName);
        })
    });
    return db;
}

function createColumnIfNotExist(newTable: knex.CreateTableBuilder, key: string) {
    const table = Database[key];
    Object.keys(table).forEach(columnName => {
        const column = table[columnName];
        if(typeof column == "string") {
            createColumnType(newTable, columnName, column);
            return;
        }
        let columnBuilder = createColumnType(newTable, columnName, column.data);
        
        if(column.type && column.type == "primary") {
            columnBuilder = columnBuilder.primary(`pk${columnName}`)
        }

        if(column.ref && column.ref.table && column.ref.column) {
            columnBuilder.references(column.ref.column).inTable(column.ref.table);
        }
    });
}

function createColumnType(newTable: knex.CreateTableBuilder, columnName: string, type: string) {
    switch(type) {
        case "integer": return newTable.integer(columnName);
        case "string": return newTable.string(columnName);
        case "text": return newTable.text(columnName);
        case "increment": return newTable.increments(columnName);
        case "boolean": return newTable.boolean(columnName);
        case "date": return newTable.date(columnName);
    }
}