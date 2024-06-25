const employees = require('../models/employees');
const empoloyees = require('../models/employees');
const bcrypt = require('bcrypt');

const addEmployee = async (req,res) => {
    console.log(req.file);
    console.log(req.body);
    const {salutation,firstname,avatar,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username,password} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || password.trim() == "" || ! "gender" in req.body || req.file == undefined){
        res.render("addEmployee",{msg:"all fields are mondatory.",firstname:firstname,avatar:req.file[0],lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
    }else{
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!await employees.findOne({email : email})){
            if(!phoneRegex.test(mobile)){
                res.render("addEmployee",{msg:"Invalid mobile number..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
            }else if(!emailRegex.test(email)){
                res.render("addEmployee",{msg:"Invalid email format..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
            }else{
                const employee = new employees({
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
                await employee.save();
                res.redirect('/admin/dashboard');
            }
        }else{
            res.render("addEmployee",{msg:"User with same email already exists..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,avatar:avatar});
        }
    }
}
const dashboard = async (req,res) => {
    const employee = await empoloyees.find();
    res.render('dashboard',{employee:employee});
}
const addEmployeeForm = (req,res) => {
    res.render("addEmployee",{msg:null,firstname:null,avatar:"logi_keyboard.jpg",lastname:null,email:null,mobile:null,dob:null,gender:null,address:null,qualifications:null,city:null,username:null,salutation:"Select",country:"Select",state:"Select"});
}
const viewEmployee = async (req,res) => {
    const {id} = req.params;
    const employee = await empoloyees.findById(id);
    res.render('viewEmployee',{employee:employee});
}
const editEmployeeForm = async(req,res) => {
    const {id} = req.params;
    const employee = await employees.findById(id);
    res.render('editEmployee',{msg:null,employee:employee});
}
const editEmployee = async (req,res) => {
    const {id} = req.params;
    const employee = await employees.findOne({_id:id});
    console.log(req.file);
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username,password} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || password.trim() == "" || ! "gender" in req.body){
        res.render('editEmployee',{msg:"Fields cannot be empty..",employee:employee});
    }else{
        if(await employees.findOne({email : email}) && employee.email != email){
            res.render('editEmployee',{msg:"User with same email exists..",employee:employee});
        }else{
            if(req.file == undefined){
                await employees.findOneAndUpdate({email:employee.email},{salutation:salutation,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,country:country,state:state,city:city,username:username,password:bcrypt.hashSync(password,10)});
                res.redirect('/admin/dashboard');
            }else{
                await employees.findOneAndUpdate({email:employee.email},{salutation:salutation,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,country:country,state:state,city:city,username:username,password:bcrypt.hashSync(password,10),avatar:req.file.filename})
                res.redirect('/admin/dashboard');
            }
        }
    }
}


module.exports = {addEmployee,dashboard,addEmployeeForm,viewEmployee,editEmployeeForm,editEmployee};