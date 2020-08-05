const dashboardRouter = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    getWhiteboard,
    updateWhiteboard
} = require('../controller/dashboard_controller');

dashboardRouter.route('/dashboard/:id')
    .get(wrapAsync(getWhiteboard));

dashboardRouter.route('/dashboard/:action')
    .post(wrapAsync(updateWhiteboard));

module.exports = dashboardRouter; 
