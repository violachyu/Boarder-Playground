const workspaceRouter = require('express').Router();
const { wrapAsync } = require('../../util/util');
const { getWorkspace, postit, template, shareRecord } = require('../controller/workspace_controller');

workspaceRouter.route('/workspace/:id')
    .get(wrapAsync(getWorkspace));

workspaceRouter.route('/postit/:action')
    .post(wrapAsync(postit));

workspaceRouter.route('/template')
    .post(wrapAsync(template));

workspaceRouter.route('/shareRecord')
    .post(wrapAsync(shareRecord));


module.exports = workspaceRouter;
