import { quotes, users } from './fakedb.js';
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import { userSchema } from './models/user.js';

const User = mongoose.model("User",userSchema);

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
        signupUser: async (_,{userNew})=>{
            const user = await User.findOne({email : userNew.email})

            if(user){
                throw new Error('Email already exists');
            }
            const hashedPassword = await bcrypt.hash(userNew.password,5)

            const newUser = new User({
                ...userNew,
                password : hashedPassword
            })
            return await newUser.save()
        }
    }
}


export default resolvers;