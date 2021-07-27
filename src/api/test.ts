import { Request, Response } from "express";
import { GetRoute } from "../router";

export class Test {
    @GetRoute("test")
    get(req: Request, res: Response) {
        res.send("Test Recieved.");
    }
}