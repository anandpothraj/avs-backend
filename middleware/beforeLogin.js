function beforeLoginToken(req, res, next) {
    const token = req.header("token");
    if (!token) {
        res.status(403).json({
            message: "Not Valid Token"
        });
    } else {
        req.token = token;
        next()
    }
}

module.exports = beforeLoginToken;