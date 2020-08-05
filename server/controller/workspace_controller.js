const workspace_model = require('../model/workspace_model');
const { responseObj } = require('../../util/util');

const getWorkspace = async (req, res) => {
    let wb_id = req.params.id;
    let { workspace_data, error } = await workspace_model.getWorkspace(wb_id);

    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send({ workspace_data });
    }

}


const postit = async (req, res) => {
    let result = {};

    if (req.params.action == 'save') {
        let postit_data = req.body.postit_data;
        result = await workspace_model.savePostit(postit_data);

    } else if (req.params.action == 'delete') {
        let delete_postit_id = req.body.postit_id;
        result = await workspace_model.deletePostit(delete_postit_id);
    }

    let { message, error } = result;

    if (error) {
        await res.status(400).send({ error });
    } else {
        await res.status(200).send({ message });
    }
}

const template = async (req, res) => {
    let wb_id = req.body.wb_id;
    let template_name = req.body.template_name;
    let { message, error } = await workspace_model.updateTemplate(wb_id, template_name);

    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send({ message });
    }
}

const shareRecord = async (req, res) => {
    let access_token = req.headers.authorization;
    let wb_id = req.body.wb_id;
    let user_id = req.body.user_id;

    let { message, error } = await workspace_model.shareRecord(access_token, wb_id, user_id);
    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send({ message });
    }
}



module.exports = {
    getWorkspace,
    postit,
    template,
    shareRecord
}





