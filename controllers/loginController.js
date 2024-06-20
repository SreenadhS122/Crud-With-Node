const homepage = (req,res) => {
    res.render("login");
}
const login = (req,res) => {
    console.log(req.body);
}

module.exports = {homepage,login};