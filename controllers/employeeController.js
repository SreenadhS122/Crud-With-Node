const employees = require('../models/employees');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpSend = require('../services/otp');
let employee,otp;

const registerPage = (req,res) => {
    res.render("register",{msg:null,firstname:null,lastname:null,email:null,mobile:null,dob:null,gender:null,address:null,qualifications:null,city:null,username:null,salutation:"Select",country:"Select",state:"Select"});
}
const register = async (req,res) => {
    console.log(req.file);
    console.log(req.body);
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username,password} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || password.trim() == "" || ! "gender" in req.body || req.file == undefined){
        res.render("register",{msg:"all fields are mondatory.",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
    }else{
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!await employees.findOne({email : email})){
            if(!phoneRegex.test(mobile)){
                res.render("register",{msg:"Invalid mobile number..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
            }else if(!emailRegex.test(email)){
                res.render("register",{msg:"Invalid email format..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
            }else{
                otp = Math.floor(1000 + Math.random() * 9000);
                employee = new employees({
                    avatar : req.file.filename,
                    salutation : salutation,
                    firstName : firstname,
                    lastName : lastname,
                    email : email,
                    mobile : mobile,
                    dob : dob,
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
                otpSend(email,otp);
                res.render('otp',{msg:null});
            }
        }else{
            res.render("register",{msg:"User with same email already exists..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
        }
    }
}
const otpVerification = async (req,res) => {
    const {currentOtp} = req.body;
    if(currentOtp == otp){
        await employee.save();
        res.render("login",{msg:"Login to continue..",email:null});
    }else{
        res.render("otp",{msg:"Invalid OTP.."});
    }
}
const editEmployeeForm = async (req,res) => {
    const {id} = req.params;
    const employee = await employees.findOne({_id:id});
    res.render("editEmployee",{employee:employee,msg:null});
}
const editEmployee = async (req,res) => {
    const {id} = req.params;
    const employee = await employees.findOne({_id:id});
    console.log(req.body);
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username,password} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || password.trim() == "" || ! "gender" in req.body){
        res.render("editEmployee",{msg:"Fields cannot be empty..",employee:employee});
    }else{
        if(await employees.findOne({email : email}) && employee.email != email){
            res.render("editEmployee",{msg:"User with same email exists..",employee:employee});
        }else{
            if(req.file == undefined){
                await employees.findOneAndUpdate({email:employee.email},{salutation:salutation,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,country:country,state:state,city:city,username:username,password:bcrypt.hashSync(password,10)});
                res.render('view',{employee:employee});
            }else{
                await employees.findOneAndUpdate({email:employee.email},{salutation:salutation,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,country:country,state:state,city:city,username:username,password:bcrypt.hashSync(password,10),avatar:req.file.filename})
                res.render('view',{employee:employee});
            }
        }
    }   
}

module.exports = {registerPage,register,otpVerification,editEmployeeForm,editEmployee};