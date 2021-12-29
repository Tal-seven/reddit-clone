import { Redis } from "ioredis";
import { v4 } from "uuid";
import { CONFIRM_EMAIL_PREFIX } from "./constants";


export const createConfirmationUrl =  async (id: number, redis: Redis): Promise<string> => {
    const token = v4();
    await redis.set(CONFIRM_EMAIL_PREFIX+token,id,"ex",60*60*24); 
    console.log(token);
    return `<a ref="http://localhost:3000/confirm/${token}">confirm email</a>`;
}