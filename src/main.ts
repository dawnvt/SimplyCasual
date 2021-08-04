import "reflect-metadata";
import express from "express";
import { readdirSync } from "fs";
import path from "path";
import { setupRoutes } from "./router";
import { buildSchema } from "type-graphql";
import { ScoreResolver, SongResolver, UserResolver } from "./api/resolver";
import { ApolloServer } from "apollo-server-express";
var files = readdirSync(path.join(__dirname, "api"));
for (let i = 0; i < files.length; i++) {
    require("./api/" + files[i]);
}

async function main() {
    const app = express();

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, ScoreResolver, SongResolver],
            emitSchemaFile: true
        })
    })

    await server.start();

    app.use(express.json());

    setupRoutes(app);

    app.use(express.static("public"));

    server.applyMiddleware({ app });

    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}

main();