import { quotes, users } from './fakedb.js';

const resolvers ={
    Query:{
        users: ()=> users,
        user: (parent,args)=> users.find((user)=> user._id==args._id),
        quotes: ()=> quotes,
        iquote: (parent,args)=> quotes.filter((quote)=> quote.by==args.by), 
    },
    User:{
        quotes: (user)=> quotes.filter((quote)=> quote.by == user._id)
    },
    Mutation:{
        signupUser: (_,{userNew})=>{

        }
    }
}


export default resolvers;