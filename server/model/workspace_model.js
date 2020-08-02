const { transaction, commit, rollback, query } = require('../../util/con');
const { isNull } = require('util');
const { access } = require('fs');

const getWorkspace = async (access_token, wb_id) => {
    try {
        // get workspace(postit) with wb_id
        // let workspaceData = await query(
        //     `SELECT * FROM postit 
        //     INNER JOIN wb ON wb.wb_id = postit.wb_id 
        //     WHERE postit.wb_id = '${wb_id}' AND postit.del IS NULL`
        // );
        console.log('wb_id', wb_id)
        let workspaceData = await query(
            `SELECT * FROM postit WHERE wb_id = '${wb_id}' AND del IS NULL`
        );
        console.log('getWork', workspaceData)

        // return workspace data
        return { workspaceData };
    } catch (error) {
        return { error }
    }
}
const saveWorkspace = async (saveWB) => {
    try {
        // reform data
        let insertWB = [];
        let insertWB_item = [];
        let { postit_id, wb_id, latest_update, position_x, position_y, text, bg_color, width, height, font_size, font_color, img, zIndex, del } = saveWB[0];
        insertWB_item.push(postit_id, wb_id, '', latest_update, position_x, position_y, text, bg_color, width, height, font_size, font_color, img, zIndex, del);
        insertWB.push(insertWB_item);
        // console.log(insertWB, 'insertWB')

        transaction();
        // insert or update data
        await query(`REPLACE INTO postit VALUES ?`, [insertWB])
        commit();
        return { message: 'Save Postit Success!' }
    } catch (error) {
        rollback();
        return { error }
    }
}
const deleteWorkspace = async (delete_postit_id) => {
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

const guestWorkspace = async (access_token, wb_id, user_id) => {
    try {
        // console.log('guest', access_token); //
        if (access_token !== 'null') {
            // check if user is guest
            let hostWB = await query(`SELECT * FROM wb WHERE wb_id = '${wb_id}'`)
            let host = hostWB[0].host
            console.log('host', typeof host, hostWB, host); //
            if (host !== user_id) { // guest
                let insertGuestWB = [[user_id, wb_id, 'guest']]
                transaction();
                await query(`REPLACE INTO user_wb VALUES ?`, [insertGuestWB])
                commit();
                return { message: 'Guest WB saved!' }
            } else {    // host
                console.log('host save');//

                let insertHostWB = [[user_id, wb_id, 'host']]
                transaction();
                await query(`REPLACE INTO user_wb VALUES ?`, [insertHostWB])
                commit();
                return { message: 'Host WB saved!' }
            }
        } else {
            console.log('anony save');//
            return { message: 'Anonymous user not allowed to save WB' }
        }
    } catch (error) {
        rollback();
        return { error }
    }
}
const templateWorkspace = async (wb_id, template) => {
    try {
        transaction();
        await query(`UPDATE postit SET template = '${template}' WHERE wb_id = '${wb_id}'`)
        commit();
        return { message: 'Templated saved!' }
    } catch (error) {
        rollback();
        return { error }
    }
}

module.exports = {
    getWorkspace,
    saveWorkspace,
    deleteWorkspace,
    guestWorkspace,
    templateWorkspace
}
