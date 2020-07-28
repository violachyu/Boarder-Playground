const { transaction, commit, rollback, query } = require('../../util/con');

const createWhiteboard = async (wb_id, user_id, title, bookmark) => {
    try {
        // reform date format
        let now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // save old wb
        let DB_title = await query(`SELECT title FROM wb WHERE user_id = '${user_id}' AND wb_id = '${wb_id}'`)

        if (DB_title[0]) {
            transaction();
            let wb_data = [[wb_id, user_id, title, now, bookmark, 'null']]
            // verify user & insert data into DB
            await query(`REPLACE INTO wb VALUES ?`, [wb_data]);
            commit();
            return { message: 'Whiteboard saved!' }
        } else {
            transaction();
            let wb_data = [[wb_id, user_id, title, now, bookmark, 'null']]
            // verify user & insert data into DB
            await query(`REPLACE INTO wb VALUES ?`, [wb_data]);
            commit();
            return { message: 'Whiteboard created!' }
        }
    } catch (error) {
        rollback();
        return { error };
    }

}
const deleteWhiteboard = async (user_id, title) => {
    try {
        if (title) {
            transaction();
            let result = await query(`DELETE FROM wb WHERE user_id = '${user_id}' AND title = '${title}'`);
            if (result.affectedRows == 0) {
                return { error: 'Cannot delete whiteboard...' }
            } else {
                commit();
                return { message: 'Whiteboard deleted!' }
            }
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
    const all_wb = await query(`SELECT wb_id, title, bookmark FROM wb WHERE user_id = '${user_id_params}'`);
    return { all_wb };
}


module.exports = {
    createWhiteboard,
    deleteWhiteboard,
    getWhiteboard
}