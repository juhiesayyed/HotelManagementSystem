const mongoose =require("mongoose");

//connecting to database
mongoose.connect("mongodb://localhost:27017/AiraHotel",{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("connection successfull...."))
.catch((err) => console.log(err));

//,useCreateIndex: true

