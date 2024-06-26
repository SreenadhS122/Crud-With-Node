const employees = require('../models/employees');
const bcrypt = require('bcrypt');

const addEmployee = async (req,res) => {
    console.log(req.body);
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username,password} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || password.trim() == "" || ! "gender" in req.body){
        res.render("addEmployee",{msg:"all fields are mondatory.",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
    }else{
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!await employees.findOne({email : email})){
            if(!phoneRegex.test(mobile)){
                res.render("addEmployee",{msg:"Invalid mobile number..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
            }else if(!emailRegex.test(email)){
                res.render("addEmployee",{msg:"Invalid email format..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
            }else{
                const employee = new employees({
                        salutation : salutation,
                        firstname : firstname,
                        lastname : lastname,
                        email : email,
                        mobile : mobile,
                        dob : dob.split("-").reverse().join("-"),
                        gender : gender,
                        address : address,
                        qualifications : qualifications,
                        country : country,
                        state : state,
                        city : city,
                        username : username,
                        password : bcrypt.hashSync(password,10),
                        admin : false
                    });
                await employee.save();
                res.redirect('/admin/dashboard');
            }
        }else{
            res.render("addEmployee",{msg:"User with same email already exists..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
        }
    }
}
const dashboard = async (req,res) => {
    const employee = await employees.find().limit(3);
    const pageLimit = Math.ceil((await employees.find()).length/3);
    res.render('dashboard',{employee:employee,limit:pageLimit,value:3});
}
const addEmployeeForm = (req,res) => {
    res.render("addEmployee",{msg:null,firstname:null,avatar:"logi_keyboard.jpg",lastname:null,email:null,mobile:null,dob:null,gender:null,address:null,qualifications:null,city:null,username:null,salutation:"Select",country:"Select",state:"Select",password:null});
}
const viewEmployee = async (req,res) => {
    const {id} = req.params;
    const employee = await employees.findById(id);
    res.render('viewEmployee',{employee:employee});
}
const editEmployeeForm = async(req,res) => {
    const {id} = req.params;
    const employee = await employees.findById(id);
    res.render('editEmployee',{msg:null,employee:employee,firstname:employee.firstname,lastname:employee.lastname,email:employee.email,mobile:employee.mobile,dob:employee.dob,gender:employee.gender,address:employee.address,qualifications:employee.qualifications,city:employee.city,username:employee.username,salutation:employee.salutation,country:employee.country,state:employee.state});
}
const editEmployee = async (req,res) => {
    const {id} = req.params;
    const employee = await employees.findOne({_id:id});
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || ! "gender" in req.body){
        res.render('editEmployee',{msg:"Fields cannot be empty..",employee:employee,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
    }else{
        if(await employees.findOne({email : email}) && employee.email != email){
            res.render('editEmployee',{msg:"User with same email exists..",employee:employee,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
        }else{
            if(!phoneRegex.test(mobile)){
                res.render("addEmployee",{msg:"Invalid mobile number..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
            }else if(!emailRegex.test(email)){
                res.render("addEmployee",{msg:"Invalid email format..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
            }else{
                await employees.findOneAndUpdate({email:employee.email},{salutation:salutation,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,country:country,state:state,city:city,username:username})
                res.redirect('/admin/dashboard');
            }
        }
    }
}
const employeeProfilePic = async (req,res) => {
    const {id} = req.params;
    await employees.findByIdAndUpdate(id,{avatar:req.file.filename});
    res.redirect(`/admin/viewEmployee/${id}`);
}
const employeeList = async (req,res) => {
    const {limit} = req.params;
    const employee = await employees.find().limit(limit);
    const pageLimit = Math.ceil((await employees.find()).length/limit);
    res.render('dashboard',{employee:employee,limit:pageLimit,value:limit});
}
const pagination = async (req,res) => {
    const {limit,page} = req.params;
    const employee = await employees.aggregate([
        {$skip : parseInt((page-1)*limit)},
        {$limit : parseInt(limit)}
    ]);
    console.log(await employees.find({
        firstname : {$regex : "ndh",$options : "si" }}
    ));
    const pageLimit = Math.ceil((await employees.find()).length/limit);
    res.render('dashboard',{employee:employee,limit:pageLimit,value:limit});
}

module.exports = {addEmployee,dashboard,addEmployeeForm,viewEmployee,editEmployeeForm,editEmployee,employeeProfilePic,employeeList,pagination};