const workspace_model = require('../model/workspace_model');

const getWorkspace = async (req, res) => {
    // console.log('wk controller');   //
    let wb_id = req.params.id;
    let access_token = req.headers.authorization;
    let { workspaceData, error } = await workspace_model.getWorkspace(access_token, wb_id);
    if (error) {
        res.status(400).send(error);
    } else {
        res.status(200).send(workspaceData);
    }

}
const saveWorkspace = async (req, res) => {
    if (req.params.id == 'save') {
        let saveWB = req.body.postit_data;

        let { message, error } = await workspace_model.saveWorkspace(saveWB);
        if (error) {
            res.status(400).send({ error });
        } else {
            res.status(200).send({ message });
        }
    } else if (req.params.id == 'delete') {
        let delete_postit_id = req.body.postit_id;
        let { message, error } = await workspace_model.deleteWorkspace(delete_postit_id);
        if (error) {
            res.status(400).send({ error });
        } else {
            res.status(200).send({ message });
        }
    }
}

const guestWorkspace = async (req, res) => {
    let access_token = req.headers.authorization
    let wb_id = req.body.wb_id
    let user_id = req.body.user_id

    let { message, error } = await workspace_model.guestWorkspace(access_token, wb_id, user_id);
    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send({ message });
    }
}



module.exports = {
    getWorkspace,
    saveWorkspace,
    guestWorkspace
}





