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
function _createFakeUser() {
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
function createFakeData() {
    // DB protection
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }

    return _createFakeUser()
        .catch(console.log);
}


/*---Truncate Fake Data---*/
function truncateFakeData() {
    // DB protection
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }

    console.log('truncate fake data');
    const setForeignKey = (status) => {
        return query('SET FOREIGN_KEY_CHECKS = ?', status);
    };

    const truncateTable = (table) => {
        return query(`TRUNCATE TABLE ${table}`);
    };

    return setForeignKey(0)
        .then(truncateTable('user'))
        .then(truncateTable('wb'))
        .then(truncateTable('postit'))
        .then(truncateTable('user_wb'))
        .then(setForeignKey(1))
        .catch(console.log);
}

function closeConnection() {
    return end();
}

// execute when called directly.
if (require.main === module) {
    console.log('main');
    truncateFakeData()
        .then(createFakeData)
        .then(closeConnection);
}

module.exports = {
    users,
    createFakeData,
    truncateFakeData,
    closeConnection,
};



