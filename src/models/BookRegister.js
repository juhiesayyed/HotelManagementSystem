const mongoose =require("mongoose");

const BookSchema= new mongoose.Schema({
   
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    aadhar:{
        type: String,
        required: true
    },
    pan:{
        type: String,
        required: true
    },
    indate:{
        type: Date,
        required:true
    },
    outdate:{
        type: Date,
        required:true
    },
    room_type:{
        type:String,
        required: true   
    },
    floar:{
        type:Number,
        required:true
    },
    roomno:{
        type:Number
    },
    status:{
        type: String,
        required: true
    },
    adv_payment:{
        type: Number
    }
})

//now we need to create a collections

const BookRegister= new mongoose.model("Booking",BookSchema);

module.exports=BookRegister;
