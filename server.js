import {ApolloServer,gql} from 'apollo-server';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import { quotes, users } from './fakedb.js';


const typeDefs = gql`
type Query {
    users : [User]
    user(id:ID!) : User
    quotes : [Quote]
    iquote(by:ID!) : [Quote]
}
type User{
    id: ID!
    firstName: String
    lastName: String
    email: String
    password: String
    quotes: [Quote]
}
type Quote{
    name: String!
    by: ID
}
`

const resolvers ={
    Query:{
        users: ()=> users,
        user: (parent,args)=> users.find((user)=> user.id==args.id),
        quotes: ()=> quotes,
        iquote: (parent,args)=> quotes.filter((quote)=> quote.by==args.by), 
    },
    User:{
        quotes: (user)=> quotes.filter((quote)=> quote.by == user.id)
    }
}

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