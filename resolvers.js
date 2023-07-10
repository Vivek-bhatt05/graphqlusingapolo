import { quotes, users } from './fakedb.js';

const resolvers ={
    Query:{
        users: ()=> users,
        user: (parent,args)=> users.find((user)=> user.id==args.id),
        quotes: ()=> quotes,
        iquote: (parent,args)=> quotes.filter((quote)=> quote.by==args.by), 
    },
    User:{
        quotes: (user)=> quotes.filter((quote)=> quote.by == user.id)
    },
    Mutation:{
        signupUserDummy: (_,{userNew})=>{
            const id=Math.floor(Date.now()/100);
            users.push({
                id,
                ...userNew
            })
            return users.find((user)=> user.id == id);
        }
    }
}


export default resolvers;