const workspaceRouter = require('express').Router();
const { wrapAsync } = require('../../util/util');
const { getWorkspace, saveWorkspace } = require('../controller/workspace_controller');

workspaceRouter.route('/getWorkspace/:id')
    .get(wrapAsync(getWorkspace));


workspaceRouter.route('/saveWorkspace/:id')
    .post(wrapAsync(saveWorkspace));


module.exports = workspaceRouter;
