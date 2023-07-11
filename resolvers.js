import { quotes, users } from './fakedb.js';
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import { userSchema } from './models/user.js';
import { quoteSchema } from './models/quotes.js';
import { key } from './config.js';
import jwt from 'jsonwebtoken'

const User = mongoose.model("User",userSchema);
const Quote = mongoose.model("Quote",quoteSchema);

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
        },

        signinUser: async (_,{userSignin})=>{
           const user = await User.findOne({email : userSignin.email})
           if(!user){
            throw new Error('No User Found');
           }
          const isMatched = await bcrypt.compare(userSignin.password,user.password);

          if(!isMatched){
            throw new Error("Email or Password is wrong")
          }

          const token = jwt.sign({userId : user._id},key)

          return {token}
        },

        createQuote: async (_,{name},{userId})=>{
            if(!userId){
                throw new Error('Must Login');
            }
            const newQuote = new Quote({
                name,
                by:userId
            })
             await newQuote.save()
             return "Quote post successful"
        },

    }
}


export default resolvers;