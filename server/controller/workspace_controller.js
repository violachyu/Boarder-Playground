const workspace_model = require('../model/workspace_model');
const { responseObj } = require('../../util/util');

const get_workspace = async (req, res) => {
    let wb_id = req.params.id;
    let { workspace_data, error } = await workspace_model.get_workspace(wb_id);

    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send({ workspace_data });
    }

};


const update_postit = async (req, res) => {
    let postit_data = req.body.postit_data;
    let { message, error } = await workspace_model.update_postit(postit_data);

    if (error) {
        await res.status(400).send({ error });
    } else {
        await res.status(200).send({ message });
    }
};

const delete_postit = async (req, res) => {
    let delete_postit_id = req.body.postit_id;
    let { message, error } = await workspace_model.delete_postit(delete_postit_id);

    if (error) {
        await res.status(400).send({ error });
    } else {
        await res.status(200).send({ message });
    }
};

const template = async (req, res) => {
    let wb_id = req.body.wb_id;
    let template_name = req.body.template_name;
    let { message, error } = await workspace_model.update_template(wb_id, template_name);

    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send({ message });
    }
};

const share_record = async (req, res) => {
    let access_token = req.headers.authorization;
    let wb_id = req.body.wb_id;
    let user_id = req.body.user_id;

    let { message, error } = await workspace_model.share_record(access_token, wb_id, user_id);
    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send({ message });
    }
};



module.exports = {
    get_workspace,
    update_postit,
    delete_postit,
    template,
    share_record
};





