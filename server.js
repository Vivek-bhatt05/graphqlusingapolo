import {ApolloServer} from 'apollo-server';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import mongoose from 'mongoose';
import { mongoURL } from './config.js';
import resolvers from './resolvers.js';
import typeDefs from './schema.js';

mongoose.connect(mongoURL)

mongoose.connection.on("connect",()=>{
    console.log("Connected to MongoDB")
})

mongoose.connection.on("error",(err)=>{
    console.log("error in connecting",err)
})


const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground
    ]
  });

  server.listen('4000').then(({url})=>{
    console.log(`🚀 Server ready at ${url}`)
  })