const User = require("../model/UserModel");
const Count = require("../model/Count");
const userDb = require("../db/userDb");
const validate = require("validate.js");


exports.signUp = async (request, response, next) => {
    try {
        async function signUp({ data }) {
            const emailRegEx = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,128}$/;
            const password = data.password;
            const email = data.email;
            if (!passwordRegex.test(password)) {
                return { "error": "Strengthen your password with some numbers, capital letters and at least 7 characters. Safety first!" };
            }
            if (!emailRegEx.test(email)) {
                return { "error": "That email doesn't look right. Could you double-check it?" };
            }
            let result = await userDb.signUp(data);
            return result;
        }

        let returnObject = await signUp({ data: request.body })
        response.status(200);
        response.send({ status: "success", statusCode: 200, data: returnObject });
        if (returnObject.success) {
            console.log(`New User Sign Up`);
        } else {
            console.log(`One User try to Sign Up`, returnObject);
        }
    } catch (err) {
        console.log(`One User try to Sign Up`, err);
        response.status(500);
        response.send({ status: "failed", statusCode: 500, err });
    }
}

exports.login = async (request, response, next) => {
    try {
        async function login({ data }) {
            const constraints = {
                email: {
                    presence: {
                        allowEmpty: false,
                        message: "^Email is required",
                    },
                    email: {
                        message: "^Invalid email"
                    }
                },
                password: {
                    presence: {
                        allowEmplty: false,
                        message: "^Password is Required"
                    }
                }
            };
            const error = validate(data, constraints, { format: "flat" });
            const valid = !error;
            if (!valid) {
                return {
                    success: false,
                    message: error[0],
                }
            }
            let response = await userDb.login(data);
            return {
                success: true,
                message: 'done',
                data: response
            }
        }
        let data = await login({ data: request.body });
        if (data?.success) {
            response.status(200);
            response.send(data);
        } else {
            response.status(400);
            response.send(data);
        }

    } catch (error) {
        response.status(400);
        response.send({ success: false, statusCode: 400 });
    }
}


exports.logout = async function logout(request, response, next) {
    async function logout({ data }) {
        const constraints = {
            token: {
                presence: {
                    allowEmpty: false,
                    message: "^Error! Please try again"
                }
            },
        }
        return new Promise(async function (resolve, reject) {
            const error = validate(data, constraints, { format: "flat" });
            const valid = !error;
            if (valid) {
                let response = await userDb.logout(data);
                resolve(response)
            } else {
                resolve(error[0]);
            }
        })

    }
    let returnObject = await logout({ data: request.body });
    response.status(200);
    response.send({ status: "success", statusCode: 200, data: returnObject });
}
