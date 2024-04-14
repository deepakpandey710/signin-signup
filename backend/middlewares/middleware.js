const jwt = require('jsonwebtoken');
const user = require('../model/UserModel');
const secret = "login-signup";
const { waterfall } = require('async');

const error = (res, message) => {
    res.status(500);
    res.send({
        success: false,
        message: message
    });
}

exports.checkPublicAuth = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token?.includes('Bearer ')) {
        token = token.slice(7, token.length)
    }
    if (token) {
        waterfall([
            (wcb) => {
                user.findOne({ token }).then((user) => {
                    return wcb(null, true);
                }).catch(err => {
                    wcb(true);
                });
            },
            (wcb) => {
                jwt.verify(token, secret, (err, decoded) => {
                    if (!err && decoded) {
                        req.decoded = decoded;
                        res.locals.userId = decoded._id;
                        res.locals.email = decoded.email;
                        return next();
                    } else {
                        return error(res, 'Please log in with email and password');
                    }
                });
            }
        ], (err, valid) => {
            if (err) {
                return error(res, 'Please log in with email and password');
            }
            return next();
        })
    } else {
        return error(res, 'Please log in with email and password');
    }

}
