const dashboard_model = require('../model/dashboard_model');
const { response_obj } = require('../../util/util');

let get_whiteboard = async (req, res) => {
    let user_id_params = req.params.id;
    let { all_wb, error } = await dashboard_model.get_whiteboard(user_id_params);

    response_obj(res, { all_wb }, error);
};

let update_whiteboard = async (req, res) => {
    let { wb_id, user_id, title, bookmark } = req.body;

    // verify user by id 
    if (!title) {
        res.status(400).send({ error: 'Whiteboard title is required!' });
    } else {
        let { message, error } = await dashboard_model.update_whiteboard(wb_id, user_id, title, bookmark);

        response_obj(res, { message }, error);
    }

};


let delete_whiteboard = async (req, res) => {
    let { wb_id, title } = req.body;
    let { message, error } = await dashboard_model.delete_whiteboard(wb_id, title);

    response_obj(res, { message }, error);

};


module.exports = {
    get_whiteboard,
    update_whiteboard,
    delete_whiteboard
};