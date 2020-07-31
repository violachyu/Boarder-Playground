const workspaceRouter = require('express').Router();
const { wrapAsync } = require('../../util/util');
const { getWorkspace, saveWorkspace, guestWorkspace } = require('../controller/workspace_controller');

workspaceRouter.route('/getWorkspace/:id')
    .get(wrapAsync(getWorkspace));


workspaceRouter.route('/saveWorkspace/:id')
    .post(wrapAsync(saveWorkspace));

workspaceRouter.route('/guestWorkspace')
    .post(wrapAsync(guestWorkspace));


module.exports = workspaceRouter;
