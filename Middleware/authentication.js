
const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {

    const webtoken = !!req.headers.authorization ? req.headers.authorization.split(" ")[1] : "";

    try {
        const decode = jwt.verify(webtoken, process.env.jwt_key);
        req.userdata = decode;
        next();

    }
    catch (error) {
        res.status(401).json({
            "status": 401
            , "message": "Authentication Failed !!"
            , "error": error
        });
    }

};