const mongoose =require("mongoose");

const AvaibilitySchema= new mongoose.Schema({
    RoomType:{
        type:String,
        required:true
    },
    Available:{
        type: Number,
        required:true
    }
})

const AvailabilityRegister= new mongoose.model("Availability",AvaibilitySchema);
module.exports=AvailabilityRegister;
