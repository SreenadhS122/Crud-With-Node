const employees = require('../models/employees');
const admins = require('../models/admin');
const bcrypt = require('bcrypt');

const homepage = (req,res) => {
    res.render("login",{msg:null,email:null});
}
const login = async (req,res) => {
    const{email,password} = req.body;
    if(email.trim() == "" || password.trim() == ""){
        res.render("login",{msg:"Fields should not be empty",email:email})
    }else{
        if((await employees.find({email:email})).length){
            const employee = await employees.findOne({email:email});
            if(bcrypt.compareSync(password,employee.password)){
                if(employee.admin){
                    res.send("admin");
                }else{
                    console.log(employee);
                    res.render("view",{employee: employee});
                }
            }else{
                res.render("login",{msg:"Invalid password",email:employee.email});
            }
        }else{
            const admin = await admins.findOne();
            if(admin.email == email && bcrypt.compareSync(password,admin.password)){
                res.send("admin");
            }else{
                res.render("login",{msg:"Invalid credentials",email:null});
            }
        }
    }
    console.log(req.body);
}

module.exports = {homepage,login};