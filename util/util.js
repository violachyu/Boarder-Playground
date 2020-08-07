const jwt = require('jsonwebtoken');
const signing_key = process.env.SIGNINGKEY;

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
};


const response_obj = (res, response_data, error) => {
    if (error) {
        res.status(400).send({ error });
    } else {
        res.status(200).send(response_data);
    }
};


const verify_token = async (req, res, next) => {
    let access_token = req.headers.authorization;

    try {
        // check if jwt token is valid
        let a = jwt.verify(access_token, signing_key);
        console.log(a);
        next();
    } catch (error) {
        res.status(400).send({ error: 'Permission expired, please sign in again.' });
    }
};

module.exports = {
    wrapAsync,
    response_obj,
    verify_token
};