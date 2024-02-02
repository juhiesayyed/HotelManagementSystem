const mongoose =require("mongoose");

const RoomSchema= new mongoose.Schema({
    RoomNo:{
        type: Number,
        required:true
    },
    RoomType:{
        type:String,
        required:true
    },
    Floar:{
        type: Number,
        required:true
    },
    Price:{
        type:Number,
        required:true
    },
    Room_Status:{
        type: String
    }
})

const RoomRegister= new mongoose.model("Rooms",RoomSchema);

module.exports=RoomRegister;
