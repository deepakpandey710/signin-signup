const user = require("../model/UserModel");
const { waterfall, reject } = require("async");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "login-signup";


exports.signUp = async (data) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(data.password, salt);
        let memberDetails = {
            password: pass,
            email: data.email
        }
        let memberSchema = new user(memberDetails);
        await memberSchema.save();
        return {
            success: true,
            message: "new user signed up ",
        };
    } catch (error) {
        return error;
    }
}


exports.login = (data) => {
    return new Promise(function (resolve, reject) {
        waterfall([(wcb) => {
            user.findOne({ email: data.email })
                .lean()
                .then(res => {
                    if (res) {
                        return wcb(null, res);
                    } else {
                        return resolve({
                            success: false,
                            message: "login failed",
                        });
                    }
                })
                .catch(err => {
                    return resolve({
                        success: false,
                        message: "login failed",
                    });
                });
        }, (userDetail, wcb) => {
            bcrypt.compare(data.password, userDetail.password, (err, valid) => {
                if (valid) {
                    const userObj = {
                        _id: userDetail._id,
                        email: userDetail.email,
                    };
                    const token = jwt.sign(userObj, secret);
                    user.findOneAndUpdate({ email: data.email }, { $set: { loggedInStatus: true, token } }, { new: true })
                        .then((res) => {
                            return wcb(null, {
                                token: userDetail.token,
                                email: userDetail.email,
                            });
                        }).catch(err => {
                            return resolve({
                                success: false,
                                message: "login failed",
                            });
                        });
                } else {
                    return resolve({
                        success: false,
                        message: "incorrect pwd",
                    });
                }
            });
        },
        ], (err, res) => {
            if (err) {
                return reject(err)
            } else {
                return resolve(res);
            }
        });
    })
};

exports.logout = async (data) => {
    return new Promise(function (resolve, reject) {
        const token = data.token;
        const userId = jwt.decode(token)._id;
        waterfall([
            (wcb) => {
                user.updateOne({ _id: userId }, { loggedInStatus: false }).then((res) => {
                    return wcb(null, res);
                }).catch((err) => {
                    return resolve({
                        success: false,
                        message: "logout failed",
                    });
                })
            }
        ], (err, res) => {
            if (!err && res) {
                resolve({
                    success: true,
                    message: "Logout successful",
                });
            } else {
                resolve({
                    success: false,
                    message: "logout failed",
                });
            }
        })
    })
};

