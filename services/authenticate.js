const jwt = require('jsonwebtoken');

const auth = (req,res,next) => {
    if(req.cookies.access_token){
        const access = jwt.verify(req.cookies.access_token,process.env.SECRET_KEY);
        next();
    }else{
        res.render("login",{msg:null,email:null});
    }
}

module.exports = auth;