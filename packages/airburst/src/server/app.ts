import express from "express";
import jwt from "express-jwt";
import { getTablesName } from "airburst-database";
import { initalizeDatabase, dbKnex, driver } from "../airburst";
import graphql from "express-graphql";
import { buildSchema } from "graphql";
import { getScheme } from "../airburst-graphql";

async function init() {
    await initalizeDatabase();
    const tablesName = (await getTablesName(dbKnex, driver) as {name: string}[]).map((single) => single.name);
    const app = express();
    //app.use(jwt({ secret: "lol" }).unless({ path: ["/auth"] }));

    app.use("/api", graphql({
        schema: await getScheme(tablesName),
        graphiql: true,
    }))

    app.listen(3000, () => {
        console.log("🚀 Listening...")
    })    
};

/**
 * buildSchema(`
            type Table {
                columns: [String],
                data: [String]
            }
            type Query {
                ${tablesName.map((name) => {
                    return `${name}: Table`;
                })}
            }
        `)
 */

init();
