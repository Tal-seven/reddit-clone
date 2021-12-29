import { Redis } from "ioredis";
import { v4 } from "uuid";
import {FORGOT_PASSWORD_PREFIX } from "./constants";


export const createForgotPasswordUrl =  async (id: number, redis: Redis): Promise<string> => {

    const token = v4();
    await redis.set(FORGOT_PASSWORD_PREFIX+token,id,"ex",60*60*24); 
    
    console.log(token);
    return `<a ref="http://localhost:3000/change-password/${token}">forgot password</a>`;
}