import knex from "knex";
import Bookshelf from "bookshelf";
import { createTableIfNoExist, Column, createColumnsIfNoExist } from "./airburst-create-database";

interface IDatabase {
    [x: string]: {
        [x: string] : Column
    }
}

export async function createNewDatabase(db: knex<any, unknown[]>, databaseJSON: IDatabase) {
    await createTableIfNoExist(db, "roles", newTable => {
        newTable.increments("id");
        newTable.string("name");
        newTable.string("description");
    });
    await createTableIfNoExist(db, "users", newTable => {
        newTable.increments("id");
        newTable.string("name");
        newTable.string("password");
        newTable.string("description");
        newTable.integer("role_id").unsigned();
        newTable.foreign("role_id").references("id").inTable("roles");       
    });
    await asyncForEach(db, Object.entries(databaseJSON))
}

async function asyncForEach(db: knex<any, unknown[]>, entries: [string, { [x: string]: Column; }][]) {
        for(let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            await createTableIfNoExist(db, key, newTable => {
                Object.keys(value).forEach((column) => {
                    createColumnsIfNoExist(newTable, column, value[column])
                })
            });
        }
}

export function getDatabaseObject(db: knex<any,any>) {
    
}
