import { Post } from "../entity/Post";
import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { PostInput } from "../utils/PostInput";
import { getConnection } from "typeorm";
import { MyContext } from "src/types";
import { User } from "../entity/User";
import { Updoot } from "../entity/Updoot";

@Resolver(Post)
export class PostResolver {

@Mutation(()=>Boolean)
@UseMiddleware(isAuth)
async vote(@Arg("postId",()=>Int) postId: number,
@Arg("value",()=>Int) value: number,
@Ctx() {req}:MyContext): Promise<Boolean> {
    const realValue = value !== -1? 1: -1;
    console.log("real value: ",realValue);
    const {userId} = req.session;

    const updoot = await Updoot.findOne({where: {userId: userId, postId: postId}});
    
    // new updoot, this user has not voted on this post
    if(!updoot){
   
    await getConnection().query(`
    START TRANSACTION;

    insert into updoot("userId","postId",value)
    values (${userId},${postId},${realValue});

    update post 
    set points = points + ${realValue}
    where id = ${postId};

    COMMIT;
    `);
    }
    //user updating his updoot status for the same post
    else if(updoot && updoot.value !== realValue) {
        await getConnection().query(`
        START TRANSACTION
        update updoot
        set value=$1
        where "postId"=$2 and "userId"=$3;

        update post
        set points = points + $1
        where id=$2;
        `,[realValue,postId,userId]);
    }

    return true;
}

@Query(()=>[Post])
async posts(@Arg("limit",()=>Int) limit: number,
@Arg("cursor",()=>String, {nullable: true}) cursor: string | null):Promise<Post[]> {

    const realLimit = Math.min(50,limit);
    const realLimitPlusOne = realLimit+1;

    const replacements: any[] = [realLimitPlusOne];
    if(cursor)
    {
        replacements.push(new Date(cursor));
    }

    const posts = await getConnection().query(`
     select p.*
     from post p
     ${cursor? `where p."createdAt" > $2`:""}
     order by p."createdAt" DESC
     limit $1
    `,replacements);

    return posts;
    // .getRepository(Post)
    // .createQueryBuilder("p")
    // .orderBy('"createdAt"')
    // .take(limit)
   
    // if(cursor)
    // {
    //     qbuilder.where('"createdAt" > :cursor',{
    //         cursor: new Date(cursor)
    //     });
    // }

    // return qbuilder.getMany();
}

@Query(()=>Post)
async post(@Arg("id",()=>Int) id: number): Promise<Post | undefined> {
    const post = await Post.findOne({where: {id: id}});
    return post;
}

@Mutation(()=>Boolean)
async deletePosts() {
    const posts = await Post.find();
    await Post.remove(posts);
    return true;
}

@Mutation(()=>Boolean)
async deletePost(@Arg("id",()=>Int) id:number, @Ctx() {req}:MyContext){
    const post = await Post.findOne({id});
    if(!post)
    {
        return false;
    }
    if(post?.authorId === req.session.userId) {
        await Updoot.delete({postId: id});
        await Post.delete({id});
        return true;
    }
    else{
        throw new  Error('not authorized to delete posts');
    }
}

@FieldResolver(()=>String)
textSnippet(@Root() post:Post) {
    return post.text.slice(0,50);
}

@FieldResolver(()=>User)
author(@Root() post: Post, @Ctx() {userLoader}:MyContext): Promise<User> {
    return userLoader.load(post.authorId);
}

@Mutation(()=>Post)
@UseMiddleware(isAuth)
async createPost(@Arg("input") input: PostInput,
@Ctx() {req}: MyContext): Promise<Post | undefined> {
const post= await Post.create(
    {...input, 
    authorId: req.session.userId
    }).save();
return post;
}
}