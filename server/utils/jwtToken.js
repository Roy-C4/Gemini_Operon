const jwt = require("jsonwebtoken");
require('dotenv').config();



function jwtGenerator(user_id,userType) {
    const payload = {
        user: user_id,
        userType:userType
    }

return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "3hr"})
}


module.exports = jwtGenerator;