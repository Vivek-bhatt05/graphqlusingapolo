import {ApolloServer,gql} from 'apollo-server';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';


const typeDefs = gql`
type Query {
    greet : String
}`


const resolvers ={
    Query:{
        greet : ()=> "HEllo World"
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins:[
        
    ]
  });


  server.listen('4000').then(({url})=>{
    console.log(`🚀 Server ready at ${url}`)
  })