const { transaction, commit, rollback, query } = require('../../util/con');

const createWhiteboard = async (user_id, title) => {
    try {
        // reform date format
        let now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // check duplicate wb
        let DB_title = await query(`SELECT title FROM wb WHERE user_id = '${user_id}' AND title = '${title}'`)

        if (DB_title[0]) {
            return { message: 'You\'ve created the same whiteboard title!' }
        } else {
            transaction();
            let wb_data = [[user_id, title, now]]
            // verify user & insert data into DB
            await query(`INSERT INTO wb(user_id, title, create_time) VALUES ?`, [wb_data]);
            commit();
            return { message: 'Create WB successful!' }
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
                return { message: 'Cannot delete whiteboard...' }
            } else {
                commit();
                return { message: 'Delete whiteboard successful!' }
            }
        } else {
            return { message: 'Blank board deleted!' }
        }
    } catch (error) {
        rollback();
        return { error };
    }
}

const getWhiteboard = async (access_token, user_id_params) => {
    // get all wb by user_id
    const all_wb = await query(`SELECT title FROM wb WHERE user_id = '${user_id_params}'`);
    return { all_wb };
}


module.exports = {
    createWhiteboard,
    deleteWhiteboard,
    getWhiteboard
}