import { Field, InputType } from "type-graphql";
import { UserInput } from "./UserInput";

@InputType()
export class UserRegisterInput extends UserInput{
    @Field()
    firstName: string

    @Field()
    lastName: string
}