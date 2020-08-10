const { transaction, commit, rollback, query } = require('../../util/con');

const get_workspace = async (wb_id) => {
    try {
        // get workspace(postit) with wb_id
        let workspace_data = await query(`SELECT * FROM postit
        LEFT JOIN wb ON postit.wb_id = wb.wb_id
        WHERE postit.wb_id = '${wb_id}' AND postit.del IS NULL`);

        // return workspace data
        return { workspace_data };

    } catch (error) {
        return { error };
    }
};

const update_postit = async (postit_data) => {
    try {
        // reform data
        let postit_all = [];
        let postit_item = [];
        let { postit_id, wb_id, latest_update, position_x, position_y, text, bg_color, width, height, font_size, font_color, img, zIndex, del } = postit_data[0];
        postit_item.push(postit_id, wb_id, latest_update, position_x, position_y, text, bg_color, width, height, font_size, font_color, img, zIndex, del);
        postit_all.push(postit_item);

        // insert or update data
        await query(`REPLACE INTO postit VALUES ?`, [postit_all]);
        return { message: 'Save Postit Success!' };

    } catch (error) {
        return { error };
    }
};

const delete_postit = async (delete_postit_id) => {
    try {
        await query(`UPDATE postit SET del = 'deleted' WHERE postit_id = '${delete_postit_id}'`);
        return { message: 'Postit deleted!' };
    } catch (error) {
        return { error };
    }
};

const update_template = async (wb_id, template_name) => {
    try {
        await query(`UPDATE wb SET template = '${template_name}' WHERE wb_id = '${wb_id}'`);
        return { message: 'Templated saved!' };
    } catch (error) {
        return { error };
    }
};

const share_record = async (access_token, wb_id, user_id) => {
    try {
        if (access_token !== 'null') {
            // check if user is guest
            let host_data = await query(`SELECT user_id FROM user_wb WHERE wb_id = '${wb_id}' AND role = 'host'`);
            let host_id = host_data[0].user_id;

            if (user_id == host_id) { // host
                let host_wb_data = [[user_id, wb_id, 'host']];
                await query(`REPLACE INTO user_wb VALUES ?`, [host_wb_data]);
                return { message: 'Host WB saved!' };
            } else {    // guest
                let guest_wb_data = [[user_id, wb_id, 'guest']];
                await query(`REPLACE INTO user_wb VALUES ?`, [guest_wb_data]);
                return { message: 'Guest WB saved!' };
            }
        } else {    // anonymous user
            return { message: 'Anonymous user not allowed to save WB' };
        }
    } catch (error) {
        return { error };
    }
};


module.exports = {
    get_workspace,
    update_postit,
    delete_postit,
    share_record,
    update_template
};
