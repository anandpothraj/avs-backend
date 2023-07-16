const config = require("config");
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id },config.get("jwtSecret"),{
        expiresIn:"12h",
    });
};

module.exports = generateToken;