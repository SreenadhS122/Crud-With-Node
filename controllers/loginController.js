const employees = require('../models/employees');
const admins = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const homepage = async (req,res) => {
    if(req.session.login){
        if(req.session.login.super_admin || req.session.login.admin){
            res.redirect('/admin/dashboard');
        }else if("admin" in req.session.login && !req.session.login.admin){
            const employee = await employees.findById(req.session.login._id);
            res.render('myProfile',{employee:employee});
        }
    }else{
        res.render("login",{msg:null,email:null});
    }
   
}
const login = async (req,res) => {
    const{email,password} = req.body;
    if(email.trim() == "" || password.trim() == ""){
        res.render("login",{msg:"Fields should not be empty",email:email})
    }else{
        if((await employees.find({email:email})).length){
            const employee = await employees.findOne({email:email});
            if(bcrypt.compareSync(password,employee.password)){
                const token = jwt.sign({data:employee._id},process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 });
                res.cookie("access_token", token,{
                    httpOnly : true
                });
                req.session.login = employee;
                if(employee.admin){
                    res.redirect('/admin/dashboard');
                }else{
                    res.render("myProfile",{employee: employee});
                }
            }else{
                res.render("login",{msg:"Invalid password",email:employee.email});
            }
        }else{
            const admin = await admins.findOne();
            req.session.login = admin;
            if(admin.email == email && bcrypt.compareSync(password,admin.password)){
                const token = jwt.sign({data:admin._id},process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 });
                res.cookie("access_token", token,{
                    httpOnly : true
                });
                res.redirect('/admin/dashboard');
            }else{
                res.render("login",{msg:"Invalid credentials",email:null});
            }
        }
    }
}

module.exports = {homepage,login};