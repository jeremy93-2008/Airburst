import knex from "knex";
import { sha256 } from "sha.js";
import sample from "./config/sample.json"

export function populateDatabaseWithData(db: knex<any, unknown[]>) {
    db = populateDefaultDatabaseWithData(db);
    db = populateCustomDatabaseWithData(db);
    return db;
}

function populateDefaultDatabaseWithData(db: knex<any, unknown[]>) {
    db("roles").insert({
        name: "administrator",
        description: "An Administrator role"
    });

    db("users").insert({
        name: "admin",
        description: "Administrador",
        password: new sha256().update("admin").digest("hex")
    });
    
    return db;
}

function populateCustomDatabaseWithData(db: knex<any, unknown[]>) {
    sample.forEach((tableSample: {table: string, data: any[]}) => {
        db(tableSample.table).insert(tableSample.data)
    })
    return db;
}