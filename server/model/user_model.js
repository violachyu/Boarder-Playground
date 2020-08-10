const { transaction, commit, rollback, query } = require('../../util/con');
const jwt = require('jsonwebtoken');
const signing_key = process.env.SIGNINGKEY;
const expire = process.env.TOKEN_EXPIRE;



const register = async (email, pwd) => {
    try {
        // encrypt pwd
        let payload_pwd = { pwd: pwd }; // equivalent to {pwd}
        let expire_time = { expiresIn: expire };
        let encrypted_pwd = jwt.sign(payload_pwd, signing_key, expire_time);

        // generate access_token w/ email
        let payload_token = { email: email };
        let access_token = jwt.sign(payload_token, signing_key, expire_time);

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
        return { access_token, username, user_id, message: 'Registered Successfully!' };

    } catch (error) {
        return { error };
    }
};

const login = async (email, pwd) => {
    try {
        // get data from DB
        let result = await query(`SELECT user_id, email, pwd, access_token FROM user WHERE email = '${email}'`);

        if (result[0]) {
            // get username & user_id
            let username = email.split('@')[0];
            let user_id = result[0].user_id;

            // verify email & password
            let decoded_pwd = jwt.verify(result[0].pwd, signing_key);

            if (email == result[0].email && pwd == decoded_pwd.pwd) {
                // generate new token when login
                let payload_token = { email: email };
                let expire_time = { expiresIn: expire };
                let access_token = jwt.sign(payload_token, signing_key, expire_time);

                // update new access_token into DB
                await query(`UPDATE user SET access_token = '${access_token}' WHERE user_id = '${user_id}'`);

                return { access_token: result[0].access_token, username, user_id };
            } else {
                return { error: 'Wrong password or email, please try again.' };
            }
        } else {
            return { error: 'Not a member yet, please register first.' };
        }

    } catch (error) {
        return { error };
    }

};

module.exports = {
    register,
    login
};