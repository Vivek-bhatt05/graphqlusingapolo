import {ApolloServer} from 'apollo-server';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import resolvers from './resolvers.js';
import typeDefs from './schema.js';


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