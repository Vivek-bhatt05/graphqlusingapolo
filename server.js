import {ApolloServer} from 'apollo-server';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import mongoose from 'mongoose';
import { key, mongoURL } from './config.js';
import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import jwt from 'jsonwebtoken';

mongoose.connect(mongoURL)

mongoose.connection.on("connect",()=>{
    console.log("Connected to MongoDB")
})

mongoose.connection.on("error",(err)=>{
    console.log("error in connecting",err)
})

const context=({req})=>{
    const {authorization}= req.headers;

    if(authorization){
        const {userId}= jwt.verify(authorization,key)
        return {userId};
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground
    ]
  });

  server.listen('4000').then(({url})=>{
    console.log(`🚀 Server ready at ${url}`)
  })