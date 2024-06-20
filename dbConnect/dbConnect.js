const mongoose = require('mongoose');
require('dotenv').config();

async function mongo(){
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected");
}

module.exports = {mongo};