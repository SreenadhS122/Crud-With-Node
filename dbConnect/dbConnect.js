const mongoose = require('mongoose');
require('dotenv').config();

async function mongo(){
    await mongoose.connect(process.env.MONGODB_URL);
}

module.exports = {mongo};