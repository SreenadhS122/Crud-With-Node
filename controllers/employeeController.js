const {employees} = require('../models/employees');

const registerPage = (req,res) => {
    res.render("register",{msg:null});
}
const register = async (req,res) => {
    const {salutation,firstname,lastname,email,mobile,dob,gender,address,qualifications,country,state,city,username,password} = req.body;
    if(!salutation||!firstname ||!lastname || !email || !mobile || !dob || !gender || !address || !qualifications || !country || !state || !city || !username || !password || ! "gender" in req.body){
        res.render("register",{msg:"all fields are mondatory."});
        console.log(req.file);
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
            password : password
        });
        await employee.save();
        res.render('login');
    }
}

module.exports = {registerPage,register};