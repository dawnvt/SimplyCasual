import express from "express";
import { readdirSync } from "fs";
import path from "path";
import { setupRoutes } from "./router";
var files = readdirSync(path.join(__dirname, "api"));
for (let i = 0; i < files.length; i++) {
    require("./api/" + files[i]);
}

const app = express();

app.use(express.json());

setupRoutes(app);

app.use(express.static("public"));

app.listen(3000);