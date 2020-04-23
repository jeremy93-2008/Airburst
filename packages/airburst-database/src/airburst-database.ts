import knex from "knex";
import Bookshelf from "bookshelf";
import { createTableIfNoExist, Column, createColumnsIfNoExist } from "./airburst-create-database";

interface IDatabase {
    [x: string]: {
        [x: string] : Column
    }
}

interface ISample {
    table: string;
    data: {[x: string]: string}[]
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
    await asyncForEachCustomTables(db, Object.entries(databaseJSON))
}

async function asyncForEachCustomTables(db: knex<any, unknown[]>, entries: [string, { [x: string]: Column; }][]) {
        for(let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            await createTableIfNoExist(db, key, newTable => {
                Object.keys(value).forEach((column) => {
                    createColumnsIfNoExist(newTable, column, value[column])
                })
            });
        }
}

export async function generateSampleDatabase(db: knex<any, unknown[]>, sample: ISample[]) {
    sample.forEach(async (singleSample) => {
        await populateSampleData(db, singleSample)
    })
}

async function populateSampleData(db: knex<any, unknown[]>, sample: ISample) {
    const rowLength = (await db(sample.table)).length;
    if(rowLength > 0) return;
    db(sample.table).insert({...sample.data}).then((result) => {
        console.log(result)
    });
}
