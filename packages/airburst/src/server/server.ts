import express from "express";
import jwt from "express-jwt";
import graphql from "express-graphql";

const app = express();

app.use(jwt({ secret: "lol" }).unless({ path: ["/auth"] }));
app.use("/api/get", graphql({
    schema: null,
    graphiql: true,
    rootValue: () => 1
}))

app.listen(3000, () => {
    console.log("🚀 Listening...")
})