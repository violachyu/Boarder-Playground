const dashboardRouter = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    createWhiteboard,
    deleteWhiteboard,
    getWhiteboard
} = require('../controller/dashboard_controller');

dashboardRouter.route('/dashboard/createWhiteboard')
    .post(wrapAsync(createWhiteboard));
dashboardRouter.route('/dashboard/deleteWhiteboard')
    .delete(wrapAsync(deleteWhiteboard));
dashboardRouter.route('/dashboard/:id')
    .get(wrapAsync(getWhiteboard));

module.exports = dashboardRouter; 
