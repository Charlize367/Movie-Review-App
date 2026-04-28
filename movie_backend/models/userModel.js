import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:[true, 'Username is required'],
        trim:true,
        minLength:2,
        maxLength:50,
    },
    email : {
        type:String,
        required:[true, 'Email is required'],
        unique:true,
        trim:true,
        lowercase:true,
        match: [/\S+@\S+\.\S/, 'Please fill a valid email address'],
    },
    password: {
        type:String,
        required: [true, 'Password is required'],
        minLength: 6,
    },

    role: {
        type:String,
        required:true
    },

    image : {
        type:String,
        required:true
    },

    friends: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    following: [{
        type:mongoose.Schema.Types.ObjectId,
               ref: "User"
    }],

    followers: [{
        type:mongoose.Schema.Types.ObjectId,
               ref: "User"
    }]

   }, {timestamps: true});
   

const User = mongoose.model('User', userSchema);

export default User;