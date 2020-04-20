import express from "express";
import jwt from "express-jwt";
import { buildSchema }  from "graphql";
import graphql from "express-graphql";
import { initalizeDatabase } from "../airburst";

initalizeDatabase();

const app = express();


//app.use(jwt({ secret: "lol" }).unless({ path: ["/auth"] }));

app.use("/api/get", graphql({
    schema: buildSchema(`
        type Query {
            hello: String
        }
    `),
    graphiql: true,
    rootValue: {
        hello: () => "Hello world"
    }
}))

app.listen(3000, () => {
    console.log("🚀 Listening...")
})