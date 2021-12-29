import { Field,Int,ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Updoot } from "./Updoot";
import { User } from "./User";

@Entity()
@ObjectType()
export class Post extends BaseEntity {
@Field()
@PrimaryGeneratedColumn()
id!: number

@Field(()=>String)
@Column()
title!: string

@Field(()=>String)
@Column()
text!: string

@Field(()=>Int)
@Column("int", {default: 0})
points!: number

@Field(()=>Int)
@Column()
authorId: number

@Field(()=>User)
@ManyToOne(()=>User, user=>user.posts)
author: User 

@Field(()=>Date)
@CreateDateColumn()
createdAt: Date

@Field(()=>Date)
@UpdateDateColumn()
updatedAt:Date

@Field(()=>[Updoot])
@OneToMany(()=>Updoot,updoot=>updoot.post)
updoots: Updoot[]
}