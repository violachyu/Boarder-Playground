const { transaction, commit, rollback, query } = require('../../util/con');

const createWhiteboard = async (wb_id, user_id, title, bookmark) => {
    try {
        // reform date format
        let now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // save old wb
        let oldWB = await query(`SELECT * FROM wb WHERE host = '${user_id}' AND wb_id = '${wb_id}'`)
        let wb_data = [[wb_id, user_id, title, now, bookmark, 'null']]
        let wb_pair = [[user_id, wb_id, 'host']]

        if (oldWB[0]) {  // if user is host & WB is old
            transaction();
            // verify user & insert data into DB
            await query(`REPLACE INTO wb VALUES ?`, [wb_data]);
            await query(`REPLACE INTO user_wb VALUES ?`, [wb_pair]);
            commit();
            return { message: 'Whiteboard saved!' }
        } else {
            transaction();
            // record guest into DB
            await query(`REPLACE INTO wb VALUES ?`, [wb_data]);
            await query(`REPLACE INTO user_wb VALUES ?`, [wb_pair]);
            commit();
            return { message: 'Whiteboard created!' }
        }
    } catch (error) {
        rollback();
        return { error };
    }

}
const deleteWhiteboard = async (wb_id, title) => {
    try {
        if (title) {
            transaction();
            // let result = await query(`DELETE FROM wb WHERE wb_id = '${wb_id}'`);
            await query(`DELETE FROM wb WHERE wb_id = '${wb_id}'`);
            // if (result.affectedRows == 0) {
            //     return { error: 'Cannot delete whiteboard...' }
            // } else {
            commit();
            return { message: 'Whiteboard deleted!' }
            // }
        } else {
            return { message: 'Blank whiteboard deleted!' }
        }
    } catch (error) {
        rollback();
        return { error };
    }
}

const getWhiteboard = async (access_token, user_id_params) => {
    // get all wb by user_id
    // const all_wb = await query(`SELECT wb_id, title, bookmark FROM wb 
    // WHERE user_id = '${user_id_params}'`);
    const all_wb = await query(`SELECT wb.wb_id, title, bookmark, role FROM wb 
    LEFT JOIN user_wb ON wb.wb_id = user_wb.wb_id 
    WHERE user_wb.user_id = '${user_id_params}' `);

    return { all_wb };
}


module.exports = {
    createWhiteboard,
    deleteWhiteboard,
    getWhiteboard
}