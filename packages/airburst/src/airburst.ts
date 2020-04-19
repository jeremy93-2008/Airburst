import knex from "knex";
import { database } from "./config/config.json";
import { createTablesIfNotExist } from "./airburst-database";

function connectDatabase() {
    return knex({
        client: database.driver,
        version: database.version,
        connection: {
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.database
        }
    })
}

export function initalizeDatabase() {
    let db = connectDatabase();
    db = createTablesIfNotExist(db);
}