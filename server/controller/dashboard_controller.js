const dashboard_model = require('../model/dashboard_model');

let get_whiteboard = async (req, res) => {
    let user_id_params = req.params.id;
    let { all_wb, error } = await dashboard_model.get_whiteboard(user_id_params);

    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send(all_wb);
    }
};

let update_whiteboard = async (req, res) => {
    let { wb_id, user_id, title, bookmark } = req.body;

    // verify user by id 
    if (!title) {
        res.status(400).send({ error: 'Whiteboard title is required!' });
    } else {
        let { message, error } = await dashboard_model.update_whiteboard(wb_id, user_id, title, bookmark);

        if (error) {
            res.status(400).send({ error });
        } else {
            res.status(200).send({ message });
        }
    }

};


let delete_whiteboard = async (req, res) => {
    let { wb_id, title } = req.body;
    let { message, error } = await dashboard_model.delete_whiteboard(wb_id, title);

    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send({ message });
    }
};





module.exports = {
    get_whiteboard,
    update_whiteboard,
    delete_whiteboard
};