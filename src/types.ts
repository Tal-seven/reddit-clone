import { Session } from "express-session";
import { Redis } from "ioredis";
import {Request, Response} from "express";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
    req: Request & {session: Session & {userId: number}}
    res: Response
    redis: Redis
    userLoader: ReturnType<typeof createUserLoader>
}