import { IsEmail, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UserInput {
    @Field(()=>String)
    @IsEmail()
    email: string

    @Field(()=>String)
    @MinLength(5)
    password!: string
}