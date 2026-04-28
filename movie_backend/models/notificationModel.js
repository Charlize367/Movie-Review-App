import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    from : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: String,

    message: {
        type:String,
        required:true
    },

    read : {
        type:Boolean,
        required:false
    },


   }, {timestamps: true});
   

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;