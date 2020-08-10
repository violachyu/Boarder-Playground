const { transaction, commit, rollback, query } = require('../../util/con');

const get_whiteboard = async (user_id_params) => {

    // get all wb by user_id
    const all_wb = await query(`SELECT wb.wb_id, title, bookmark, role FROM wb 
    LEFT JOIN user_wb ON wb.wb_id = user_wb.wb_id 
    WHERE user_wb.user_id = '${user_id_params}' AND wb.del IS NULL `);

    return { all_wb };
};

const update_whiteboard = async (wb_id, user_id, title, bookmark) => {
    try {
        // reform date format
        let now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // get old wb
        let old_wb = await query(`SELECT * FROM user_wb WHERE user_id = '${user_id}' AND wb_id = '${wb_id}'`);
        let wb_data = [[wb_id, title, now, bookmark]];
        let wb_pair = [[user_id, wb_id, 'host']];

        if (old_wb[0]) {  // old whiteboard update
            transaction();
            // verify user & insert data into DB
            await query(`REPLACE INTO wb(wb_id, title, create_time, bookmark) VALUES ?`, [wb_data]);
            await query(`REPLACE INTO user_wb VALUES ?`, [wb_pair]);
            commit();
            return { message: 'Whiteboard saved!' };
        } else {    // new whiteboard create
            transaction();
            await query(`REPLACE INTO wb(wb_id, title, create_time, bookmark) VALUES ?`, [wb_data]);
            await query(`REPLACE INTO user_wb VALUES ?`, [wb_pair]);
            commit();
            return { message: 'Whiteboard created!' };
        }
    } catch (error) {
        rollback();
        return { error };
    }

};
const delete_whiteboard = async (wb_id, title) => {
    try {
        if (title) {
            await query(`UPDATE wb SET del = 'deleted' WHERE wb_id = '${wb_id}'`);
            return { message: 'Whiteboard deleted!' };
        } else {
            return { message: 'Blank whiteboard deleted!' };
        }
    } catch (error) {
        return { error };
    }
};

module.exports = {
    get_whiteboard,
    update_whiteboard,
    delete_whiteboard
};