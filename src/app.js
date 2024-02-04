const express=require("express");
const path=require("path");
const MongoClient=require('mongodb').MongoClient;
const app= express();
const hbs=require("hbs");


require("./db/conn");
const EmpRegister=require("./models/EmplyeeRegister");
const BookRegister=require("./models/BookRegister");
const RoomRegister=require("./models/RoomRegister");
const { json }=require("express");



const port = process.env.PORT || 3000;

const static_path= path.join(__dirname, "../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");
const image_path=path.join(__dirname,"../templates/views/images");
 

app.use(express.json());
app.use(express.urlencoded({extended: false}))

var database
app.use(express.static(static_path));
app.use(express.static(image_path));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
let alert = require('alert'); 


//agar aslli html form nehi khula to technical issue ke isse to yaha isee print ker sakte
app.get("/",(req,res) =>{
    res.render("index");
});



//First all showing code i have written

//on ShowEmp view it sends data response in form of emplist 
app.get("/ShowEmp",(req, res) =>{
database.collection('employees').find({}).toArray((err,result)=>{
    if(err) throw err
    //res.send(result)
    res.render("ShowEmp",{
        emplist: result
        })
    })  
})

//on ShowCustomer view it sends data response in form of emplist 
app.get("/ShowCustomer",(req, res) =>{
    database.collection('bookings').find({}).toArray((err,result)=>{
        if(err) throw err
        //res.send(result)
        res.render("ShowCustomer",{
            emplist: result
            })
        })  
    })


app.get("/EmployeeForm1",(req, res) =>{
    res.render("EmployeeForm1");
});

app.post("/EmployeeForm1", async(req, res) =>{
    try{
        const register=new EmpRegister({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            joindate: req.body.bdate,
            position: req.body.position,
            address: req.body.address,
            salary: req.body.salary
        })

        const reg = await register.save();
        //kuch create kerre to 201 likna
        //res.status(201).render("index");
        res.status(201).redirect("/");
    }catch(error)
    {
        res.status(400).send(error)
    }
});

//first we will display the data of that id in form
app.get("/EmployeeEdit:id",(req,res) => {
    EmpRegister.findById(req.params.id, (err,doc)=> {
        if(err) throw err
        res.render("EmployeeEdit",{
            viewTitle: "Update Employee",
            employee: doc
        });
    });
});



//then we take that updated data and store it into db
app.post("/EmployeeEdit",(req,res) => {
    try{
    EmpRegister.findOneAndUpdate({ _id : req.body._id}, req.body, {new: true}, (err,doc) =>{
        if(!err){
            res.redirect("ShowEmp");
            //console.log("doc is : ",doc);
        }
            else{
                console.log('Error during recoverd update : ' + err);
            }
        
    });
    }
    catch(error)
    {
        res.status(400).send(error)
    }

});
   
app.get("/CustomerEdit:id1",(req,res) => {
    BookRegister.findById(req.params.id1, (err,doc)=> {
        if(err) throw err
        res.render("CustomerEdit",{
            viewTitle: "Update Customer",
            customer: doc
        });
    });
});

app.post("/CustomerEdit",(req,res) => {
    try{
        BookRegister.findOneAndUpdate({ _id : req.body._id}, req.body, {new: true}, (err,doc) =>{
            console.log(doc);
            if(!err){
            if((req.body.status) == "cancelled")
            {
                RoomRegister.findOneAndUpdate({ RoomNo : req.body.roomno}, {Room_Status : "Available"} ,{upsert: true, returnNewDocument: true},(err1,doc1) =>{
                    if(err1){
                        console.log('Error during recoverd update : ' + err1);
                    }
                    console.log(doc1);
            });
            
            res.redirect("ShowCustomer"); 
                        
                    
            }
            else{
            res.redirect("ShowCustomer");
            }
            //console.log("doc is : ",doc);
        }
            else{
                console.log('Error during recoverd update : ' + err);
            }
        
    });
    }
    catch(error)
    {
        res.status(400).send(error)
    }

});
   

app.get("/EmployeeForm",(req, res) =>{
    res.render("EmployeeForm");
});

//create a new user in our database
app.post("/EmployeeForm", async(req, res) =>{
    try{
        const register=new EmpRegister({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            joindate: req.body.bdate,
            position: req.body.position,
            address: req.body.address,
            salary: req.body.salary
        })

        const reg = await register.save();
        //kuch create kerre to 201 likna
        //res.status(201).render("index");
        res.redirect("ShowEmp");
    }catch(error)
    {
        res.status(400).send(error)
    }
});

app.get('/delete/:id',(req, res) =>{
    EmpRegister.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/');
        }
        else{
            console.log('Error in Employee Delete : '+ err);
        }
    });
});

app.get('/delete1/:id',(req, res) =>{
    BookRegister.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/');
        }
        else{
            console.log('Error in Customer Delete : '+ err);
        }
    });
});

app.get("/BookNow",(req, res) =>{
    res.render("BookNow");
});


app.post("/BookNow", async(req, res) =>{
    let flag = 6;
    RoomRegister.findOne({RoomNo : req.body.roomno},async (err,doc)=>{
        if(!err){
            console.log(doc.Room_Status);
            if((doc.Room_Status) == "Available")
            {
                console.log("in availabel");
                console.log("in create data");
                try{
                    const regi=new BookRegister({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        phone: req.body.phone,
                        aadhar: req.body.aadharno,
                        pan: req.body.panno,
                        indate: req.body.indate,
                        outdate: req.body.outdate,
                        room_type: req.body.roomtype,
                        roomno: req.body.roomno,
                        floar: req.body.floar,
                        status: req.body.status,
                        adv_payment: req.body.advpay
                    })
            
                    const reg = await regi.save();
                    //kuch create kerre to 201 likna
                    RoomRegister.findOneAndUpdate({ RoomNo : req.body.roomno}, {Room_Status : "Not Available"} ,{upsert: true, returnNewDocument: true},(err1,doc1) =>{
                        if(err1){
                            console.log('Error during recoverd update : ' + err1);
                        }
                        console.log(doc1);
                });
                    
                res.status(201).render("index");
            
                }catch(error)
                {
                    res.status(400).send(error)
                }
            }
            else{
                console.log("not possible");
                alert(+req.body.roomno+" Room is already Booked");
                res.redirect('/');
            }
            console.log(flag);
        }
        else{
            console.log('Error in Employee Delete : '+ err);
        }
    });

});

app.get("/AvailabilRooms",(req, res) =>{
    database.collection('rooms').find({}).toArray((err,result)=>{
        if(err) throw err
        //res.send(result)

        res.render("AvailabilRooms",{
            roomlist: result
            })
        })  
    })


    app.get("/NotAvailabilRooms",(req, res) =>{
        database.collection('bookings').find({}).toArray((err,result)=>{
            if(err) throw err
            //res.send(result)
    
            res.render("NotAvailabilRooms",{
                roomlist: result
                })
            })  
        })
app.listen(port, () =>{
    console.log(`server is running at port no ${port}`);
    MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser: true},(error, result)=>{
        if(error) throw error
        database=result.db('AiraHotel')
    });

});
