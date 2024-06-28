const logout = (req,res) => {
    res.clearCookie("access_token").redirect('/');
}

module.exports = {logout};