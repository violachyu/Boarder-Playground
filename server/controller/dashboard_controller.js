const dashboard_model = require('../model/dashboard_model');

let createWhiteboard = async (req, res) => {
    // verify user by id 
    let { user_id, title } = req.body;
    if (!title) {
        res.status(400).send({ message: 'Whiteboard title is required!' })
    } else {
        let { message, error } = await dashboard_model.createWhiteboard(user_id, title);
        if (error) {
            res.status(400).send({ error })
        } else {
            res.status(200).send({ message });
        }
    }
}

let deleteWhiteboard = async (req, res) => {
    let { user_id, title } = req.body;
    let { message, error } = await dashboard_model.deleteWhiteboard(user_id, title);
    if (error) {
        res.status(400).send({ error })
    } else {
        res.status(200).send({ message });
    }
}

let getWhiteboard = async (req, res) => {
    let user_id_params = req.params.id;
    let access_token = req.headers.authorization;
    let { all_wb, error } = await dashboard_model.getWhiteboard(access_token, user_id_params);

    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send(all_wb);
    }
}



module.exports = {
    getWhiteboard,
    createWhiteboard,
    deleteWhiteboard
}