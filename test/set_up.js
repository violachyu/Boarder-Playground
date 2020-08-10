const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { NODE_ENV } = process.env;
const { truncate_fake_data, create_fake_data } = require('./fake_data_generator');

chai.use(chaiHttp);

const assert = chai.assert;
const requester = chai.request(app).keepOpen(); // non-login user

// describe('timeout', () => {
before(async () => {
    if (NODE_ENV !== 'test') {
        throw 'Not in test env';
    }

    await truncate_fake_data();
    await create_fake_data();
});
// }).timeout(5000);

module.exports = {
    assert,
    requester,
};