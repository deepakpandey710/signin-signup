const user = require("../controller/UserController");
const publicAuth = require("../middlewares/middleware")
const router= require("express").Router();
router.post('/login', user.login);
router.post('/signup', user.signUp);
// router.post('/googleLogin', user.googleLogin);


router.post('/logout', publicAuth.checkPublicAuth, user.logout);
// router.post('/getProfile', publicAuth.checkPublicAuth, user.getProfile);
// router.post('/getUsers', publicAuth.checkPublicAuth, user.getUsers);

module.exports=router;