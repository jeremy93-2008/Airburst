import knex from "knex";
import fs from "fs";
import Path from "path";
import Process from "process"
import { createNewDatabase } from "airburst-database";

function connectDatabase() {
    const connectionJson = fs.readFileSync(Path.resolve(__dirname, "./config/connection.json"), { encoding: "utf8" });
    const json = JSON.parse(connectionJson);
    const database = json.database;
    return knex({
        client: database.driver,
        version: database.version,
        connection: {
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.database,
            filename: database.filename
        }
    })
}

function loadCustomDatabase() {
    const databaseJson = fs.readFileSync(Path.resolve(__dirname, "./config/database.json"), { encoding: "utf8" });
    const json = JSON.parse(databaseJson);
    return json;
}

export function initalizeDatabase() {
    let db = connectDatabase();
    createNewDatabase(db, loadCustomDatabase());
}