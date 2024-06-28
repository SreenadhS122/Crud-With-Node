const employees = require('../models/employees');
const admins = require('../models/admin');
const bcrypt = require('bcrypt');

const addEmployee = async (req,res) => {
    console.log(req.body);
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username,password} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || password.trim() == "" || ! "gender" in req.body){
        res.render("addEmployee",{msg:"all fields are mondatory.",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password,loginUser:req.session.login});
    }else{
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!await employees.findOne({email : email})){
            if(!phoneRegex.test(mobile)){
                res.render("addEmployee",{msg:"Invalid mobile number..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password,loginUser:req.session.login});
            }else if(!emailRegex.test(email)){
                res.render("addEmployee",{msg:"Invalid email format..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password,loginUser:req.session.login});
            }else{
                const employee = new employees({
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
                await employee.save();
                res.redirect('/admin/dashboard');
            }
        }else{
            res.render("addEmployee",{msg:"User with same email already exists..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password,loginUser:req.session.login});
        }
    }
}
const dashboard = async (req,res) => {
    const employee = await employees.find().limit(3);
    const pageLimit = Math.ceil((await employees.find()).length/3);
    res.render('dashboard',{employee:employee,limit:pageLimit,value:3,ind:1,loginUser:req.session.login});
}
const addEmployeeForm = (req,res) => {
    res.render("addEmployee",{msg:null,firstname:null,lastname:null,email:null,mobile:null,dob:null,gender:null,address:null,qualifications:null,city:null,username:null,salutation:"Select",country:"Select",state:"Select",password:null,loginUser:req.session.login});
}
const viewEmployee = async (req,res) => {
    const {id} = req.params;
    const employee = await employees.findById(id);
    res.render('viewEmployee',{employee:employee,loginUser:req.session.login});
}
const editEmployeeForm = async(req,res) => {
    const {id} = req.params;
    const employee = await employees.findById(id);
    res.render('editEmployee',{msg:null,employee:employee,firstname:employee.firstname,lastname:employee.lastname,email:employee.email,mobile:employee.mobile,dob:employee.dob,gender:employee.gender,address:employee.address,qualifications:employee.qualifications,city:employee.city,username:employee.username,salutation:employee.salutation,country:employee.country,state:employee.state,loginUser:req.session.login});
}
const editEmployee = async (req,res) => {
    const {id} = req.params;
    const employee = await employees.findOne({_id:id});
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username} = req.body;
    if(salutation == "Select"||firstname.trim() == "" || lastname.trim() == "" || email.trim() == "" || mobile.trim() == "" || dob.trim() == "" || address.trim() == "" || qualifications.trim() == "" || country == "Select" || state == "Select" || city.trim() == "" || username.trim() == "" || ! "gender" in req.body){
        res.render('editEmployee',{msg:"Fields cannot be empty..",employee:employee,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,loginUser:req.session.login});
    }else{
        if(await employees.findOne({email : email}) && employee.email != email){
            res.render('editEmployee',{msg:"User with same email exists..",employee:employee,firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state});
        }else{
            if(!phoneRegex.test(mobile)){
                res.render("editEmployee",{msg:"Invalid mobile number..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password,loginUser:req.session.login});
            }else if(!emailRegex.test(email)){
                res.render("editEmployee",{msg:"Invalid email format..",firstname:firstname,lastname:lastname,email:email,mobile:mobile,dob:dob,gender:gender,address:address,qualifications:qualifications,city:city,username:username,salutation:salutation,country:country,state:state,password:password,loginUser:req.session.login});
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
    res.render('dashboard',{employee:employee,limit:pageLimit,value:limit,ind:1,loginUser:req.session.login});
}
const pagination = async (req,res) => {
    const {limit,page} = req.params;
    const employee = await employees.aggregate([
        {$skip : parseInt((page-1)*limit)},
        {$limit : parseInt(limit)}
    ]);
    const pageLimit = Math.ceil((await employees.find()).length/limit);
    res.render('dashboard',{employee:employee,limit:pageLimit,value:limit,ind:page,loginUser:req.session.login});
}
const searchEmployee = async (req,res) => {
    const {search} = req.body;
    const searchedEmployee = await employees.find({
        $or:[{firstname : {$regex : `${search}`,$options : "i" }},
             {lastname : {$regex : `${search}`,$options : "i" }},
             {email : {$regex : `${search}`,$options : "i" }},
             {mobile : {$regex : `${search}`,$options : "i" }}
        ]}).limit(3);
    const pageLimit = Math.ceil(searchedEmployee.length/3);
    res.render('dashboard',{employee:searchedEmployee,limit:pageLimit,value:3,ind:1,loginUser:req.session.login});
}
const deleteEmployee = async (req,res) => {
    const {id} = req.params;
    await employees.findByIdAndDelete(id);
    res.redirect('/admin/dashboard');
}
const makeAdmin = async(req,res) => {
    const {id} = req.params;
    if((await employees.findById(id)).admin){
        await employees.findByIdAndUpdate(id,{admin:false});
    }else{
        await employees.findByIdAndUpdate(id,{admin:true});
    }
    res.redirect('/admin/dashboard');
}
const adminProfile = async (req,res) => {
    const {id} = req.params;
    if(await admins.findById(id)){
        console.log(await admins.findById(id));
        res.render('adminProfile',{employee:await admins.findById(id),loginUser:req.session.login});
    }else{
        res.render('adminProfile',{employee:await employees.findById(id),loginUser:req.session.login});
    }
}


module.exports = {addEmployee,dashboard,addEmployeeForm,viewEmployee,editEmployeeForm,editEmployee,employeeProfilePic,employeeList,pagination,searchEmployee,deleteEmployee,makeAdmin,adminProfile};