const mongoose =require("mongoose");

const employeeSchema= new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    joindate:{
        type: Date,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    }
})

//now we need to create a collections

const EmpRegister= new mongoose.model("Employee",employeeSchema);

module.exports=EmpRegister;
