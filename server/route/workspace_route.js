const workspaceRouter = require('express').Router();
const { wrapAsync, verify_token } = require('../../util/util');
const { get_workspace, update_postit, delete_postit, template, record } = require('../controller/workspace_controller');

workspaceRouter.route('/workspace/:id')
    .get(wrapAsync(get_workspace));

workspaceRouter.route('/postit')
    .post(wrapAsync(update_postit));

workspaceRouter.route('/postit')
    .delete(wrapAsync(delete_postit));

workspaceRouter.route('/template')
    .patch(wrapAsync(template));

workspaceRouter.route('/record')
    .post(wrapAsync(record));


module.exports = workspaceRouter;
