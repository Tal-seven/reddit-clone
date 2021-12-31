import "reflect-metadata";
import "dotenv-safe/config";
// import {createConnection} from "typeorm";
import express from "express";
// import { ApolloServer } from "apollo-server-express";
// import { buildSchema } from "type-graphql";
// import { HelloResolver } from "./resolvers/helloworld";
// import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
// import session from "express-session";
// import connectRedis from "connect-redis";
// import  Redis  from "ioredis";
// import { UserResolver } from "./resolvers/users";
// import { COOKIE_NAME } from "./utils/constants";
// import cors from "cors";
// import { PostResolver } from "./resolvers/posts";
// import { createUserLoader } from "./utils/createUserLoader";
// import { User } from "./entity/User";
// import { Post } from "./entity/Post";
// import path from "path";
// import { Updoot } from "./entity/Updoot";

const main = async () => {
    // const connection = await createConnection({
    //     type: "postgres",
    //     url: process.env.DATABASE_URL,
    //     //synchronize: true,
    //     logging: true,
    //     entities: [Post,User,Updoot],
    //     migrations: [path.join(__dirname, "./migrations/*")],
    // });
    // console.log(connection);
//    await connection.runMigrations();

    const app = express();
//     app.set('proxy',1);
//     app.use(cors({
//         credentials: true,
//         origin: "http://localhost:3000",
//     }));

//     const RedisStore = connectRedis(session);
//     const redis = new Redis(process.env.REDIS_URL);
//     app.use(session({
//         name: COOKIE_NAME,
//         store: new RedisStore({client: redis,disableTouch: true}),
//         saveUninitialized: false,
//         resave: false,
//         secret: process.env.SESSION_SECRET,
//         cookie: {
//             maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
//             secure: false,
//             httpOnly: true,
//             sameSite: "lax",
//         },
//     }))



//     const apolloServer = new ApolloServer({
//         schema: await buildSchema({
//             resolvers: [HelloResolver, UserResolver, PostResolver],
//             validate: false,
//         }),
//         plugins: [
//             ApolloServerPluginLandingPageGraphQLPlayground({
//               // options
//             })],
//         context:({req, res}) => ({req, res, redis,userLoader: createUserLoader()}),
//     });

//     await apolloServer.start();
//     apolloServer.applyMiddleware({app, cors:false});
// //    app.get('/',(_,res)=>{
//  //       res.send('hello');
//         // next();
//    // })

   const port = process.env.PORT || 4000;
   console.log("PORT: ",process.env.PORT);
    app.listen(port,()=>{
        console.log("server started on localhost:4000");
    })

//     const posts = await orm.em.find(Post,{});
//     console.log(posts);
}
main();
