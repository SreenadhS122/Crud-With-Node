const employees = require('../models/employees');
const bcrypt = require('bcrypt');
const otpSend = require('../services/otp');
const jwt = require('jsonwebtoken');
const { findByIdAndUpdate } = require('../models/admin');
let employee,otp;

const registerPage = (req,res) => {
    res.render("register",{msg:null,firstname:null,lastname:null,email:null,mobile:null,dob:null,gender:null,address:null,qualifications:null,city:null,username:null,password:null,salutation:"Select",country:"Select",state:"Select"});
}
const register = async (req,res) => {
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username,password} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || password.trim() == "" || ! "gender" in req.body){
        res.render("register",{msg:"all fields are mondatory.",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
    }else{
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!await employees.findOne({email : email})){
            if(!phoneRegex.test(mobile)){
                res.render("register",{msg:"Invalid mobile number..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
            }else if(!emailRegex.test(email)){
                res.render("register",{msg:"Invalid email format..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
            }else{
                otp = Math.floor(1000 + Math.random() * 9000);
                employee = new employees({
                    salutation : salutation,
                    firstname : firstname,
                    lastname : lastname,
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
            res.render("register",{msg:"User with same email already exists..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
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
const editProfileForm = async (req,res) => {
    const {id} = req.params;
    const employee = await employees.findOne({_id:id});
    res.render("editProfile",{employee:employee,msg:null,firstname:employee.firstname,lastname:employee.lastname,email:employee.email,mobile:employee.mobile,dob:employee.dob,gender:employee.gender,address:employee.address,qualifications:employee.qualifications,city:employee.city,username:employee.username,salutation:employee.salutation,country:employee.country,state:employee.state});
}
const editProfile = async (req,res) => {
    const {id} = req.params;
    const employee = await employees.findOne({_id:id});
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || ! "gender" in req.body){
        res.render("editProfile",{msg:"Fields cannot be empty..",employee:employee,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
    }else{
        if(await employees.findOne({email : email}) && employee.email != email){
            res.render("editProfile",{msg:"User with same email exists..",employee:employee,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
        }else{
            if(!phoneRegex.test(mobile)){
                res.render("addEmployee",{msg:"Invalid mobile number..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
            }else if(!emailRegex.test(email)){
                res.render("addEmployee",{msg:"Invalid email format..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password});
            }else{
                await employees.findByIdAndUpdate(id,{salutation:salutation,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,country:country,state:state,city:city,username:username});
                res.redirect(`/employee/${id}`);
            }
        }
    }   
}

const profile = async (req,res) => {
    const{id} = req.params;
    const employee = await employees.findById(id);
    res.render('myProfile',{employee:employee});
}

const profilePic = async (req,res) => {
    console.log(req.file);
    const {id} = req.params;
    await employees.findByIdAndUpdate(id,{avatar:req.file.filename});
    res.redirect(`/employee/${id}`);
}

module.exports = {registerPage,register,otpVerification,editProfileForm,editProfile,profile,profilePic};