import { User } from "../entity/User";
import { UserRegisterInput } from "../utils/UserRegisterInput";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import  argon2  from "argon2";
import { UserInput } from "../utils/UserInput";
import { MyContext } from "../types";
import { UserResponse } from "../utils/UserResponse";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";
import { sendEmail } from "../utils/sendEmail";
import {CONFIRM_EMAIL_PREFIX, COOKIE_NAME, FORGOT_PASSWORD_PREFIX} from "../utils/constants"
import { createForgotPasswordUrl } from "../utils/createForgotPasswordUrl";

@Resolver(User)
export class UserResolver {
    @Mutation(()=>UserResponse, {nullable: true})
    async registerUser(@Arg("input") {email, firstName, lastName, password}: UserRegisterInput,
    @Ctx() {redis}:MyContext): Promise<UserResponse|undefined> {

        const hashedPassword = await argon2.hash(password)
        const user = await User.create({email,firstName,lastName, password: hashedPassword}).save();

        if(!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "failed to create user, please retry"
                    }
                ]
            }
        }
        const url = await createConfirmationUrl(user.id, redis);
        sendEmail(email,url);
        return {user};
    }

    @Mutation(()=>Boolean)
    logout(@Ctx() {req,res}:MyContext) {
    return new Promise((resolve) => {

        req.session.destroy((err: any)=> {
            res.clearCookie(COOKIE_NAME);
            if(err)
            {
                resolve(false);
                return
            }
            else {
                resolve(true);
            }
        })
    })
    }

    @Mutation(()=>UserResponse)
    async confirmUser(@Arg("token") token: string, 
    @Ctx() {redis}:MyContext) : Promise<UserResponse> {
        const id = await redis.get(CONFIRM_EMAIL_PREFIX+token);
        if(!id) {
            return {
                errors: [{
                    field: "email",
                    message: "Activation link expired"
                }]
            };
        }

        const user = await User.findOne({where: {id}});
        user!.confirmed = true;
        console.log(user);
        User.update({id: parseInt(id,10)},{confirmed: true})
        redis.del(CONFIRM_EMAIL_PREFIX+token);

        return {user};
    }

    @FieldResolver(()=>String)
    email(@Root() root: User,@Ctx() {req}:MyContext) {
        if(root.id === req.session.userId){
            return root.email;
        }
        else{
            return "";
        }
    }


    @Mutation(()=>UserResponse)
    async login(@Arg("input") {email, password}: UserInput,
                @Ctx() {req,res}:MyContext): Promise<UserResponse> {
        const user = await User.findOne({where: {email}});
        if(!user)
        {
            return {
                errors: [
                    {
                        field: "email",
                        message: "email not registered"
                    }
                ]
            };
        }
        if(user.confirmed){
            const result = await argon2.verify(user.password, password);
            if(result) {
                req.session.userId = user.id;
                console.log('----------');
                console.log(res);
                return {user}
            }

            return {
                errors: [{
                    field: "password",
                    message: "Incorrect password"
                }]
            }
        }

        return {
            errors: [{
                field: "email",
                message: "User not activated, please activate via the confirmation email"
            }]
        }
    }

    @Mutation(()=>Boolean)
    async forgotPassword(@Arg("email") email: string,
    @Ctx() {redis}:MyContext): Promise<boolean> {
        const user = await User.findOne({where: {email}});
        if(!user)
        {
            return true;
        }

        const url = await createForgotPasswordUrl(user.id,redis);
        sendEmail(email,url);
        return true;
    }

    @Mutation(()=>UserResponse)
    async changePassword(@Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() {req,redis}:MyContext) : Promise<UserResponse | undefined> {
        const id = await redis.get(FORGOT_PASSWORD_PREFIX+token);
      
        if(!id) {
            return {
                errors: [{
                    field: "password",
                    message: "token expired"
                }]
            }
        }

        const user = await User.findOne({where: {id}});
        user!.password = await argon2.hash(newPassword);
        await User.update(user!.id,user!);
        redis.del(FORGOT_PASSWORD_PREFIX+token);
        req.session.userId = parseInt(id,10);

        return {user};
    }

   
    @Query(()=>User, {nullable: true})
    async Me(@Ctx() {req}: MyContext){

    if(!req.session.userId)
    {
        console.log("user not logged in")
        return null;
    }
    
    const user = await User.findOne({id: req.session.userId});
    console.log("user : ",user)
    return (user !== undefined) ? user : null;
    }
}