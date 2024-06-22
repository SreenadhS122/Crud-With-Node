const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const adminSchema = new Schema({
    email : {
        type : String
    },
    password : {
        type : String
    }
});

const admins = model("admin",adminSchema);

module.exports = admins;