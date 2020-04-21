import knex from "knex";
import fs from "fs";

function connectDatabase() {
    const connectionJson = fs.readFileSync("./config/connection.json", { encoding: "utf8" });
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

export function initalizeDatabase() {
    let db = connectDatabase();
}