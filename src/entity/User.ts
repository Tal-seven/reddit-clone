import { Field, Int, ObjectType, Root } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";
import { IsEmail } from "class-validator";
import { Updoot } from "./Updoot";

@Entity()
@ObjectType()
export class User extends BaseEntity{
@Field(()=>Int)
@PrimaryGeneratedColumn()
id!: number

@Field(()=>String)
@Column()
firstName: string

@Field(()=>String)
@Column()
lastName: string

@Field(()=>Date)
@CreateDateColumn()
createdAt: Date

@Field(()=>Date)
@UpdateDateColumn()
updatedAt: Date

@Field(()=>String)
name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
}

@Field(()=>String)
@Column()
@IsEmail({unique: true})
email!: string

@Column()
password!: string


@OneToMany(()=>Post, post=>post.author)
posts: Post[]

@Field(()=>Boolean)
@Column("bool",{default: false})
confirmed: boolean

@Field(()=>[Updoot])
@OneToMany(()=>Updoot,updoot=>updoot.user)
updoots: Updoot[]
}