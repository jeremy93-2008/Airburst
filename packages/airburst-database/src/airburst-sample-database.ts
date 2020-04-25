import knex from "knex";
import sha256 from 'crypto-js/sha256';
import { ISample } from "./airburst-database";

export async function generateSampleDatabase(db: knex<any, unknown[]>, sample: ISample[]) {
    await populateDefaultSampleData(db);
    sample.forEach(async (singleSample) => {
        await populateCustomSampleData(db, singleSample);
    });
}

async function populateDefaultSampleData(db: knex<any, unknown[]>) {
    const rolesLength = (await db("roles")).length;
    const usersLength = (await db("users")).length;
    if (rolesLength == 0) {
        db("roles").insert([
            {
                name: "Administrator",
                description: "Administrator Role",
                weight: 4
            },
            {
                name: "Editor",
                description: "Editor Role",
                weight: 3
            },
            {
                name: "Moderator",
                description: "Moderator Role",
                weight: 2
            },
            {
                name: "User",
                description: "User Role",
                weight: 1
            }
        ]).then();
    }
    if (usersLength == 0) {
        db("users").insert({
            name: "admin",
            password: sha256("admin").toString(),
            description: "Content Administrator",
            role_id: 1
        }).then();
    }
}

async function populateCustomSampleData(db: knex<any, unknown[]>, sample: ISample) {
    const rowLength = (await db(sample.table)).length;
    if (rowLength > 0)
        return;
    const data = sample.data.map((singleData) => {
        return singleData;
    });
    db(sample.table).insert([...data]).then();
}
