const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const employeeSchema = new Schema({
        salutation: {
            type : String
        },
        firstname : {
            type : String
        },
        lastname : {
            type : String
        },
        email : {
            type : String
        },
        mobile : {
            type : String
        },
        dob : {
            type : String
        },
        gender : {
            type : String
        },
        address : {
            type : String
        },
        qualifications : {
            type : String
        },
        country : {
            type : String
        },
        state : {
            type : String
        },
        city : {
            type : String
        },
        username : {
            type : String
        },
        password : {
            type : String
        },
        avatar : {
            type : String
        },
        admin : {
            type : Boolean
        }
});

const employees = model("employee",employeeSchema);

module.exports = employees;