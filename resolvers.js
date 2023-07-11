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
        users: async ()=> await User.find({}),
        user: async (parent,{_id})=> await User.findOne({_id}),
        quotes: async ()=> await Quote.find({}).populate("by","_id firstName") ,
        iquote: async (parent,{by})=> await Quote.find({by}),
    },
    User:{
        quotes: async (user)=> await Quote.find({by:user._id})
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
        updateQuote: async (_, { _id, name, by }) => {
            try {
              const updatedQuote = await Quote.findByIdAndUpdate(_id, { name, by }, { new: true });
              return updatedQuote;
            } catch (error) {
              throw new Error('Failed to update book.');
            }
          },

          deleteQuote: async (_, { _id }) => {
            try {
              const deletedQuote = await Quote.findByIdAndDelete(_id);
              return deletedQuote;
            } catch (error) {
              throw new Error('Failed to delete book.');
            }
          },

    }
}


export default resolvers;