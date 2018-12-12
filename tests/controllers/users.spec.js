const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../server');
const { user } = require('../../models');

// setup chai to use http assertion
chai.use(chaiHttp);

// test user object
const testUser = {
  email: 'test@chai.com',
  password: 'password'
};

// start our tests
describe('Users:', () => {

  // DELETE TEST USERS AFTER EACH TEST COMPLETES
  afterEach(async () => {
    await user.deleteMany({ email: 'test@chai.com' });
  });

  // CREATE USER TEST
  it('should create a new user /api/v1/users POST', async() => {
    const res = await chai.request(server).post(`/api/v1/users`).send(testUser);
    res.should.have.status(200);
    res.should.be.json;
  });

  // LOGIN USER TEST
  it('should login a user /api/v1/users/login POST', async() => {
    await chai.request(server).post(`/api/v1/users`).send(testUser);
    const res = await chai.request(server).post(`/api/v1/users/login`).send(testUser);
    res.should.have.status(200);
    res.should.be.json;
  });
});