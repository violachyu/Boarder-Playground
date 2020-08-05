const { transaction, commit, rollback, query } = require('../../util/con');

const getWorkspace = async (wb_id) => {
    try {
        // get workspace(postit) with wb_id
        let workspace_data = await query(`SELECT * FROM postit
        LEFT JOIN wb ON postit.wb_id = wb.wb_id
        WHERE postit.wb_id = '${wb_id}' AND postit.del IS NULL`);

        // return workspace data
        return { workspace_data };

    } catch (error) {
        return { error }
    }
}

const savePostit = async (postit_data) => {
    try {
        // reform data
        let postit_all = [];
        let postit_item = [];
        let { postit_id, wb_id, latest_update, position_x, position_y, text, bg_color, width, height, font_size, font_color, img, zIndex, del } = postit_data[0];
        postit_item.push(postit_id, wb_id, latest_update, position_x, position_y, text, bg_color, width, height, font_size, font_color, img, zIndex, del);
        postit_all.push(postit_item);

        transaction();
        // insert or update data
        await query(`REPLACE INTO postit VALUES ?`, [postit_all])
        commit();
        return { message: 'Save Postit Success!' }

    } catch (error) {
        rollback();
        return { error }
    }
}

const deletePostit = async (delete_postit_id) => {
    try {
        transaction();
        await query(`UPDATE postit SET del = 'deleted' WHERE postit_id = '${delete_postit_id}'`)
        commit();
        return { message: 'Postit deleted!' }
    } catch (error) {
        rollback();
        return { error }
    }
}

const updateTemplate = async (wb_id, template_name) => {
    try {
        transaction();
        await query(`UPDATE wb SET template = '${template_name}' WHERE wb_id = '${wb_id}'`)
        commit();
        return { message: 'Templated saved!' }
    } catch (error) {
        rollback();
        return { error }
    }
}

const shareRecord = async (access_token, wb_id, user_id) => {
    try {
        if (access_token !== 'null') {
            // check if user is guest
            let host_data = await query(`SELECT user_id FROM user_wb WHERE wb_id = '${wb_id}' AND role = 'host'`)
            let host_id = host_data[0].user_id

            if (user_id == host_id) { // host
                let host_wb_data = [[user_id, wb_id, 'host']]
                transaction();
                await query(`REPLACE INTO user_wb VALUES ?`, [host_wb_data])
                commit();
                return { message: 'Host WB saved!' }
            } else {    // guest
                let guest_wb_data = [[user_id, wb_id, 'guest']]
                transaction();
                await query(`REPLACE INTO user_wb VALUES ?`, [guest_wb_data])
                commit();
                return { message: 'Guest WB saved!' }
            }
        } else {    // anonymous user
            return { message: 'Anonymous user not allowed to save WB' }
        }
    } catch (error) {
        rollback();
        return { error }
    }
}


module.exports = {
    getWorkspace,
    savePostit,
    deletePostit,
    shareRecord,
    updateTemplate
}
