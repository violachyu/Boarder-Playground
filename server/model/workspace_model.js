const { transaction, commit, rollback, query } = require('../../util/con');
const { isNullOrUndefined } = require('util');

const getWorkspace = async (access_token, wb_id) => {
    try {
        // get user_id with access token
        // let user_id = await query(`SELECT user_id FROM user WHERE access_token ='${access_token}'`)

        // get workspace(postit) with wb_id
        let workspaceData = await query(`SELECT * FROM postit INNER JOIN wb ON wb.wb_id = postit.wb_id WHERE postit.wb_id = '${wb_id}' AND postit.del IS NULL`);
        // console.log('getwork', workspaceData);  //

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
        let { postit_id, user_id, wb_id, position_x, position_y, text, bg_color, width, height, font_size, font_color, img, zIndex, del } = saveWB[0];
        insertWB_item.push(postit_id, user_id, wb_id, position_x, position_y, text, bg_color, width, height, font_size, font_color, img, zIndex, del);
        insertWB.push(insertWB_item);

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
        // await query(`DELETE FROM postit WHERE postit_id = '${delete_postit_id}'`)
        await query(`UPDATE postit SET del = 'deleted' WHERE postit_id = '${delete_postit_id}'`)
        commit();
        return { message: 'Delete Postit Success!' }
    } catch (error) {
        rollback();
        return { error }
    }
}


module.exports = {
    getWorkspace,
    saveWorkspace,
    deleteWorkspace
}
