import { User } from "../entity/User";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Error {
    @Field()
    field: string

    @Field()
    message: string
}

@ObjectType()
export class UserResponse {
    @Field(()=>[Error],{nullable: true})
    errors?: Error[]

    @Field(()=>User, {nullable: true})
    user?: User
}