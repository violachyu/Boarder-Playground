require('dotenv').config();
const { NODE_ENV } = process.env;
const { transaction, commit, query, rollback, end } = require('../util/con');
/*---encryption---*/
const jwt = require('jsonwebtoken');
const signing_key = process.env.SIGNINGKEY;
const expire = process.env.TOKEN_EXPIRE;

/*---Fake Data---*/
const users = [
    // native
    {
        user_id: Date.now(),
        email: 'test@test.com',
        pwd: 'test',
        access_token: 'test_token'
    }
];

/*---Create Fake Data---*/
function _create_fake_user() {
    // encrypt pwd
    let payload_pwd = { pwd: users[0].pwd }; // equivalent to {pwd}
    let expire_time = { expiresIn: expire };
    let encrypted_pwd = jwt.sign(payload_pwd, signing_key, expire_time);

    const encryped_users = users.map(user => {
        const encryped_user = {
            user_id: user.user_id,
            email: user.email,
            pwd: encrypted_pwd,
            access_token: user.access_token
        };
        return encryped_user;
    });
    return query('INSERT INTO user VALUES ?', [encryped_users.map(x => Object.values(x))]);
}

/*---Execution---*/
function create_fake_data() {
    // DB protection
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }

    return _create_fake_user()
        .catch(console.log);
}


/*---Truncate Fake Data---*/
function truncate_fake_data() {
    // DB protection
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }

    console.log('truncate fake data');
    const set_foreign_key = (status) => {
        return query('SET FOREIGN_KEY_CHECKS = ?', status);
    };

    const truncate_table = (table) => {
        return query(`TRUNCATE TABLE ${table}`);
    };

    return set_foreign_key(0)
        .then(truncate_table('user'))
        .then(truncate_table('wb'))
        .then(truncate_table('postit'))
        .then(truncate_table('user_wb'))
        .then(set_foreign_key(1))
        .catch(console.log);
}

function close_connection() {
    return end();
}

// execute when called directly.
if (require.main === module) {
    console.log('main');
    truncate_fake_data()
        .then(create_fake_data)
        .then(close_connection);
}

module.exports = {
    users,
    create_fake_data,
    truncate_fake_data,
    close_connection,
};



