import fs from "fs";
import Path from "path";
import knex from "knex";

import { createNewDatabase, generateSampleDatabase } from "airburst-database";

export let dbKnex: knex<any, unknown[]> | null = null;
export let driver: string = "";
export let databaseName: string = "";

function connectDatabase() {
    const connectionJson = fs.readFileSync(Path.resolve(__dirname, "./config/connection.json"), { encoding: "utf8" });
    const json = JSON.parse(connectionJson);
    const database = json.database;
    driver = database.driver;
    databaseName = database.database;
    /**
     * Client: mssql, mysql, sqlite3, postgres, oracle
     */
    dbKnex = knex({
        client: database.driver,
        version: database.version,
        connection: {
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.database,
            filename: database.filename
        }
    });
    return dbKnex;
}

function loadCustomDatabase() {
    const databaseJson = fs.readFileSync(Path.resolve(__dirname, "./config/database.json"), { encoding: "utf8" });
    const json = JSON.parse(databaseJson);
    return json;
}

function loadSampleData() {
    const sampleJson = fs.readFileSync(Path.resolve(__dirname, "./config/sample.json"), { encoding: "utf8" });
    const json = JSON.parse(sampleJson);
    return json;    
}

export async function initalizeDatabase() {
    let db = connectDatabase();
    await createNewDatabase(db, loadCustomDatabase());
    await generateSampleDatabase(db, loadSampleData());
}