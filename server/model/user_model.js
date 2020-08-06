const { transaction, commit, rollback, query } = require('../../util/con');
const jwt = require('jsonwebtoken');
const signingKey = process.env.SIGNINGKEY;
const expire = process.env.TOKEN_EXPIRE;



const register = async (email, pwd) => {
    try {
        // encrypt pwd
        let payload_pwd = { pwd: pwd }; // equivalent to {pwd}
        let encrypted_pwd = jwt.sign(payload_pwd, signingKey, expire);

        // generate access_token w/ email
        let payload_token = { email: email };
        let access_token = jwt.sign(payload_token, signingKey, expire);

        // create random user_id (6 digits)
        let user_id = Date.now();

        // get username
        let username = email.split('@')[0];

        // duplicate email check
        let exist_email = await query(`SELECT email FROM user WHERE email = ? FOR UPDATE`, [email]);
        if (exist_email.length > 0) {
            await commit();
            return { error: 'Email Already Exists' };
        }

        // reform data
        let register_data = [[user_id, email, encrypted_pwd, access_token]];

        // write register_data into DB
        await query(`INSERT INTO user(user_id, email, pwd, access_token) VALUES ?`, [register_data]);
        return { access_token, username, user_id, message: 'Register Successfully!' };

    } catch (error) {
        return { error };
    }
};

const login = async (email, pwd) => {
    try {
        // get data from DB
        let result = await query(`SELECT user_id, email, pwd, access_token FROM user WHERE email = '${email}'`);

        // get username & user_id
        let username = email.split('@')[0];
        let user_id = result[0].user_id;

        // verify email & password
        let decoded_pwd = jwt.verify(result[0].pwd, signingKey);

        if (email == result[0].email && pwd == decoded_pwd.pwd) {
            return { access_token: result[0].access_token, username, user_id };
        } else {
            return { error: 'Wrong password or email, please try again.' };
        }
    } catch (error) {
        return { error };
    }

};

module.exports = {
    register,
    login
};