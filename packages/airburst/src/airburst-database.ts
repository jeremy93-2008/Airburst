import knex from "knex";
import Database from "./config/database.json";
import { populateDatabaseWithData } from "./airburst-sample";

function createCustomTablesIfNotExist(db: knex<any, unknown[]>) {
    Object.keys(Database).forEach((tableName) => {
        db.schema.hasTable(tableName).then((isExist) => {
            if (isExist) return;

            db.schema.createTable(tableName, (newTable) => {
                createColumnIfNotExist(newTable, tableName);
            }).then();
        })
    });
    return db;
}

function createColumnIfNotExist(newTable: knex.CreateTableBuilder, key: string) {
    const table = Database[key];
    Object.keys(table).forEach(columnName => {
        const column = table[columnName];
        if (typeof column == "string") {
            createColumnType(newTable, columnName, column);
            return;
        }

        if (column.ref && column.ref.table && column.ref.column) {
            newTable.foreign(columnName).references(column.ref.column).inTable(column.ref.table);
        }

        let columnBuilder = createColumnType(newTable, columnName, column.data);

        if (!columnBuilder) return;

        if (column.type && column.type == "primary") {
            columnBuilder = columnBuilder.primary(`pk${columnName}`)
        }
    });
}

function createColumnType(newTable: knex.CreateTableBuilder, columnName: string, type: string) {
    switch (type) {
        case "integer": return newTable.integer(columnName);
        case "uinteger": return newTable.integer(columnName).unsigned();
        case "string": return newTable.string(columnName);
        case "text": return newTable.text(columnName);
        case "increment": return newTable.increments(columnName);
        case "boolean": return newTable.boolean(columnName);
        case "date": return newTable.date(columnName);
    }
}

export function createTablesIfNotExist(db: knex<any, unknown[]>) {
    db.schema.hasTable("roles").then((isExist) => {
        if (isExist) return;

        db.schema.createTable("roles", (newTable) => {
            newTable.increments("id");
            newTable.string("name");
            newTable.string("description");
        }).then();
    }).then(() => {
        db.schema.hasTable("users").then((isExist) => {
            if (isExist) return;

            db.schema.createTable("users", (newTable) => {
                newTable.increments("id");
                newTable.string("name");
                newTable.string("description");
                newTable.string("password");
                newTable.integer("role").unsigned();
                newTable.foreign("role").references("id").inTable("roles");
            }).then();
        })
    }).then(() => {
        createCustomTablesIfNotExist(db);
    }).finally(() => {
        populateDatabaseWithData(db);
    })

    return db;
}