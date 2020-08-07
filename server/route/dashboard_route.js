const dashboardRouter = require('express').Router();
const { wrapAsync, verify_token } = require('../../util/util');

const {
    get_whiteboard,
    update_whiteboard,
    delete_whiteboard
} = require('../controller/dashboard_controller');

dashboardRouter.route('/dashboard/:id')
    .get(verify_token, wrapAsync(get_whiteboard));

dashboardRouter.route('/dashboard')
    .post(wrapAsync(update_whiteboard));

dashboardRouter.route('/dashboard')
    .delete(wrapAsync(delete_whiteboard));

module.exports = dashboardRouter; 
