const user_model = require('../model/user_model')
const expire = process.env.TOKEN_EXPIRE;
const validator = require('validator');



/*---User API---*/
const register = async (req, res) => {
    const { email, pwd } = req.body;

    // user_error_handling: untyped email or pwd
    if (!email || !pwd) {
        res.status(400).send({ error: 'Request Error: email and password are required.' });
        return;
    }
    // user_error_handling: wrong email format
    if (!validator.isEmail(email)) {
        res.status(400).send({ error: 'Request Error: Invalid email format' });
        return;
    }

    // Register: insert user data into DB
    const { access_token, username, user_id, message, error } = await user_model.register(email, pwd);
    if (error) {
        res.status(403).send({ error });
        return;
    }

    res.status(200).send({ access_token, username, user_id, message });
}

const login = async (req, res) => {
    let { email, pwd } = req.body;

    // user_error_handling: untyped email or pwd
    if (!email || !pwd) {
        res.status(400).send({ error: 'Request Error: email and password are required.' });
        return;
    }
    // user_error_handling: wrong email format
    if (!validator.isEmail(email)) {
        res.status(400).send({ error: 'Request Error: Invalid email format' });
        return;
    }

    // get access_token after verification
    let { access_token, username, user_id, error } = await user_model.login(email, pwd);

    // user_error_handling: wrong password
    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send({ access_token, username, user_id });
    }


}

module.exports = { register, login }