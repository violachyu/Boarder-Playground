const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { NODE_ENV } = process.env;
const { truncateFakeData, createFakeData } = require('./fake_data_generator');

chai.use(chaiHttp);

const assert = chai.assert;
const requester = chai.request(app).keepOpen(); // non-login user

// describe('timeout', () => {
before(async () => {
    if (NODE_ENV !== 'test') {
        throw 'Not in test env';
    }

    await truncateFakeData();
    await createFakeData();
});
// }).timeout(5000);

module.exports = {
    assert,
    requester,
};