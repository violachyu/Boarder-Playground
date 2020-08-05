const userRouter = require('express').Router();
const { wrapAsync } = require('../../util/util');


const { register, login } = require('../controller/user_controller');

userRouter.route('/register')
    .post(wrapAsync(register));

userRouter.route('/login')
    .post(wrapAsync(login));

// userRouter.route('/verify')
//     .get(wrapAsync(verify));


module.exports = userRouter;

