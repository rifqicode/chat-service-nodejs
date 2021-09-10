const request = require('supertest');
const assert = require('assert');
// app is supposed to point to the app.js file
const app = require('../app');

describe('User Login & Register Test', () => {
    it('Login test', async () => {
        const response = await request(app)
            .post('/users/authentication')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                username: "test",
                password: "password"
            })
            .expect(200);

        assert.equal(response);
    });
});

