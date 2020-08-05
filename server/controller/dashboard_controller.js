const dashboard_model = require('../model/dashboard_model');

let getWhiteboard = async (req, res) => {
    let user_id_params = req.params.id;
    let { all_wb, error } = await dashboard_model.getWhiteboard(user_id_params);

    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send(all_wb);
    }
}

let updateWhiteboard = async (req, res) => {
    let { wb_id, user_id, title, bookmark } = req.body;

    if (req.params.action == 'create') {
        // verify user by id 
        if (!title) {
            res.status(400).send({ error: 'Whiteboard title is required!' })
        } else {
            let { message, error } = await dashboard_model.createWhiteboard(wb_id, user_id, title, bookmark);
            if (error) {
                res.status(400).send({ error })
            } else {
                res.status(200).send({ message });
            }
        }
    } else if (req.params.action == 'delete') {
        let { message, error } = await dashboard_model.deleteWhiteboard(wb_id, title);
        if (error) {
            res.status(400).send({ error })
        } else {
            res.status(200).send({ message });
        }
    }

}





module.exports = {
    getWhiteboard,
    updateWhiteboard
}