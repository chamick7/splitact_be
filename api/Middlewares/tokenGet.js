const jwt = require("jsonwebtoken");


module.exports = (req,res,next) => {
    try {
        console.log(req.body);
        
        const decode = jwt.verify(req.body.token, process.env.JWT_SECRET);

        req.accountData = decode;

        next();

    } catch (error) {

        res.status(401).json({
            status: "Error",
            code: "AC0031"
        })
        
    }
}