require('dotenv').config();
const { assert, requester } = require('./set_up');
const { users } = require('./fake_data_generator');
const { query } = require('../util/con');
const jwt = require('jsonwebtoken');
const signing_key = process.env.SIGNINGKEY;
const expire = process.env.TOKEN_EXPIRE;


/*---Register---*/
describe('user', () => {
    describe('register', async () => {
        it('#Normal register', async () => {
            const new_user = {
                email: 'test@123.com',
                pwd: 'test'
            };

            const res = await requester
                .post('/api/1.0/user/register')
                .send(new_user);    // act as request body, frontend

            const data = res.body; // response obj from API

            const register_expect = {   // set expected data obj
                access_token: data.access_token,
                username: 'test',
                user_id: data.user_id,
                message: 'Registered Successfully!'
            };

            assert.deepEqual(data, register_expect);

            // verify access_token
            let decoded_access_token = jwt.verify(data.access_token, signing_key);
            assert.deepEqual(decoded_access_token.email, 'test@123.com');

        });


        it('register without email or password', async () => {
            // user without pwd
            const user_without_pwd = {
                email: 'test@123.com',
                pwd: ''
            };

            const res_without_pwd = await requester
                .post('/api/1.0/user/register')
                .send(user_without_pwd);

            const data1 = res_without_pwd.body;

            assert.equal(res_without_pwd.statusCode, 400);
            assert.deepEqual(data1.error, 'Request Error: email and password are required.');

            // user without email
            const user_without_email = {
                email: '',
                pwd: 'test'
            };

            const res_without_email = await requester
                .post('/api/1.0/user/signup')
                .send(user_without_email);

            const data2 = res_without_email.body;

            assert.equal(res_without_email.statusCode, 400);
            assert.deepEqual(data2.error, 'Request Error: email and password are required.');
        });

    });

    /*---Login---*/
    describe('login', async () => {
        it('Login with correct password', async () => {
            const user_raw = users[0];
            const login_user = {
                email: user_raw.email,
                pwd: user_raw.pwd
            };

            const res = await requester
                .post('/api/1.0/user/login')
                .send(login_user);

            const data = res.body;

            const login_expect = {
                user_id: data.user_id, // need id from returned data
                access_token: 'test_token',
                username: 'test'
            };

            assert.deepEqual(data, login_expect);

            // Make sure access_token is changed
            const db_access_token = await query(
                'SELECT access_token FROM user WHERE email = ?',
                [login_user.email]
            );

            assert.notDeepEqual(db_access_token, login_expect.access_token);

        });
    });

});

