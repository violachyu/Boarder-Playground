const userRouter = require('express').Router();
const { wrapAsync } = require('../../util/util');


const { user } = require('../controller/user_controller');

userRouter.route('/user/:action')
    .post(wrapAsync(user));


// userRouter.route('/verify')
//     .get(wrapAsync(verify));


module.exports = userRouter;

