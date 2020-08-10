const workspace_model = require('../model/workspace_model');
const { response_obj } = require('../../util/util');

const get_workspace = async (req, res) => {
    let wb_id = req.params.id;
    let { workspace_data, error } = await workspace_model.get_workspace(wb_id);

    response_obj(res, { workspace_data }, error);
};


const update_postit = async (req, res) => {
    let postit_data = req.body.postit_data;
    let { message, error } = await workspace_model.update_postit(postit_data);

    response_obj(res, { message }, error);

};

const delete_postit = async (req, res) => {
    let delete_postit_id = req.body.postit_id;
    let { message, error } = await workspace_model.delete_postit(delete_postit_id);

    response_obj(res, { message }, error);
};

const template = async (req, res) => {
    let wb_id = req.body.wb_id;
    let template_name = req.body.template_name;
    let { message, error } = await workspace_model.update_template(wb_id, template_name);

    response_obj(res, { message }, error);
};

const record = async (req, res) => {
    let access_token = req.headers.authorization;
    let wb_id = req.body.wb_id;
    let user_id = req.body.user_id;

    let { message, error } = await workspace_model.share_record(access_token, wb_id, user_id);
    response_obj(res, { message }, error);

};



module.exports = {
    get_workspace,
    update_postit,
    delete_postit,
    template,
    record
};





